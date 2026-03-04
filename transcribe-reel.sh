#!/bin/bash
# Instagram Reel Transcriber - Fully Automatic
# Usage: ./transcribe-reel.sh <instagram-url>

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <instagram-url>"
    exit 1
fi

URL="$1"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
WORK_DIR="/tmp/reel-$$-$TIMESTAMP"
TRANSCRIPTS_DIR="/home/administrator/vayron/transcripts"
VENV="/home/administrator/vayron/whisper-env"

echo "📥 Laddar ner Instagram Reel..."
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Ladda ner med yt-dlp
yt-dlp -o "video.%(ext)s" "$URL" > download.log 2>&1

# Hitta den nedladdade filen
VIDEO_FILE=$(ls video.* 2>/dev/null | head -n 1)
if [ -z "$VIDEO_FILE" ]; then
    echo "❌ Kunde inte ladda ner videon"
    cat download.log
    exit 1
fi

echo "🎵 Extraherar ljud..."
ffmpeg -i "$VIDEO_FILE" -vn -acodec copy audio.m4a -y > /dev/null 2>&1

echo "🎧 Transkriberar med Whisper..."
source "$VENV/bin/activate"
whisper audio.m4a \
    --model base \
    --language sv \
    --output_dir "$WORK_DIR" \
    --output_format srt \
    > whisper.log 2>&1

# Extrahera ren text från SRT (ta bort timestamps och radnummer)
grep -v '^[0-9]*$' audio.srt | grep -v '^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]' | grep -v '^$' > audio.txt

# Hämta titel från metadata om möjligt
TITLE=$(grep -oP '"title":\s*"\K[^"]+' download.log 2>/dev/null | head -n 1 || echo "reel")
TITLE=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9åäöÅÄÖ ]//g' | sed 's/ /_/g' | cut -c1-50)

# Generera filnamn
OUTPUT_BASE="$TRANSCRIPTS_DIR/${TIMESTAMP}_${TITLE}"

# Kopiera resultat
cp audio.txt "$OUTPUT_BASE.txt"
cp audio.srt "$OUTPUT_BASE.srt"

# Skapa metadata-fil
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio.m4a 2>/dev/null | cut -d. -f1)
cat > "$OUTPUT_BASE.meta" <<EOF
URL: $URL
Datum: $(date '+%Y-%m-%d %H:%M:%S')
Längd: ${DURATION}s
Transkribering: Whisper (base model, svenska)
EOF

echo ""
echo "✅ Klar! Transkriptionen sparad:"
echo "📄 Text: $OUTPUT_BASE.txt"
echo "🎬 Undertext: $OUTPUT_BASE.srt"
echo "📋 Metadata: $OUTPUT_BASE.meta"
echo ""
echo "Förhandsgranskning:"
echo "─────────────────────────────────────"
head -n 20 "$OUTPUT_BASE.txt"
LINES=$(wc -l < "$OUTPUT_BASE.txt")
if [ "$LINES" -gt 20 ]; then
    echo "... ($((LINES - 20)) rader till)"
fi
echo "─────────────────────────────────────"

# Rensa temp
cd /
rm -rf "$WORK_DIR"

echo ""
echo "💾 Alla transkriptioner: $TRANSCRIPTS_DIR"
echo "📍 Kopiera från: $OUTPUT_BASE.txt"
