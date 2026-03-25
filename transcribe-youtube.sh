#!/usr/bin/env bash
# transcribe-youtube.sh – download YouTube Shorts/Videos and run Whisper
# ---------------------------------------------------------------
# 1️⃣ Download audio with yt-dlp
# 2️⃣ Convert to wav (whisper prefers mono 16kHz)
# 3️⃣ Run Whisper (base model, Swedish)
# 4️⃣ Save .txt, .srt and .meta in ~/transcripts/
# ---------------------------------------------------------------

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <youtube-url>"
  exit 1
fi

URL="$1"
TMPDIR=$(mktemp -d)
OUTDIR="${HOME}/transcripts"
mkdir -p "$OUTDIR"

# Get video id and title for filename
VID_ID=$(yt-dlp --get-id "$URL")
TITLE=$(yt-dlp --get-title "$URL" | tr -d '/\\:*?\"<>|')
DATE=$(date +"%Y%m%d-%H%M%S")
BASENAME="${DATE}_${TITLE// /_}"

# Download best audio only (m4a)
yt-dlp -f "bestaudio[ext=m4a]" -o "${TMPDIR}/${BASENAME}.m4a" "$URL"

# Convert to wav (mono 16kHz)
ffmpeg -y -i "${TMPDIR}/${BASENAME}.m4a" -ac 1 -ar 16000 "${TMPDIR}/${BASENAME}.wav"

# Activate whisper env (assumed at $HOME/whisper-env)
source "${HOME}/whisper-cpu-env/bin/activate"
whisper "${TMPDIR}/${BASENAME}.wav" \
  --model base \
  --language sv \
  --output_dir "$TMPDIR" \
  --output_format txt,srt

deactivate

# Move results
mv "${TMPDIR}/${BASENAME}.txt" "${OUTDIR}/${BASENAME}.txt"
mv "${TMPDIR}/${BASENAME}.srt" "${OUTDIR}/${BASENAME}.srt"
# Create meta file
cat <<EOF > "${OUTDIR}/${BASENAME}.meta"
url: $URL
youtube_id: $VID_ID
title: $TITLE
date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
duration: $(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${TMPDIR}/${BASENAME}.wav") seconds
EOF

# Cleanup
rm -rf "$TMPDIR"

echo "✅ Transkribering klar! Files under ${OUTDIR}/${BASENAME}"
