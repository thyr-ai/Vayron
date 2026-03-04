#!/bin/bash
# Instagram Reel Transcriber with Translation
# Usage: ./transcribe-reel-v2.sh <instagram-url>

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
VIDEO_FILE=$(ls video.* | head -n 1)
if [ -z "$VIDEO_FILE" ]; then
    echo "❌ Kunde inte ladda ner videon"
    cat download.log
    exit 1
fi

echo "🎵 Extraherar ljud..."
ffmpeg -i "$VIDEO_FILE" -vn -acodec copy audio.m4a -y > /dev/null 2>&1

echo "🎧 Transkriberar med Whisper (auto-detect språk)..."
source "$VENV/bin/activate"

# Transkribera utan språk-spec för auto-detect
whisper audio.m4a \
    --model base \
    --output_dir "$WORK_DIR" \
    --output_format txt \
    --output_format srt \
    --output_format json \
    > whisper.log 2>&1

# Hämta detekterat språk från JSON
DETECTED_LANG=$(grep -oP '"language":\s*"\K[^"]+' audio.json 2>/dev/null || echo "unknown")

# Hämta titel från metadata om möjligt
TITLE=$(grep -oP '"title":\s*"\K[^"]+' download.log 2>/dev/null | head -n 1 || echo "reel")
TITLE=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9åäöÅÄÖ ]//g' | sed 's/ /_/g' | cut -c1-50)

# Generera filnamn
OUTPUT_BASE="$TRANSCRIPTS_DIR/${TIMESTAMP}_${TITLE}"

# Kopiera original-transkription
cp audio.txt "$OUTPUT_BASE.original.txt"
cp audio.srt "$OUTPUT_BASE.original.srt"

echo "🌍 Detekterat språk: $DETECTED_LANG"

# Om inte svenska, översätt
if [ "$DETECTED_LANG" != "swedish" ] && [ "$DETECTED_LANG" != "sv" ]; then
    echo "🇸🇪 Översätter till svenska..."
    
    # Skapa översättning med Claude via OpenClaw
    cat > translate_prompt.txt <<'EOFPROMPT'
Översätt följande text till svenska. Behåll naturligt talspråk och känsla. Ge endast översättningen, ingen kommentar:

EOFPROMPT
    cat audio.txt >> translate_prompt.txt
    
    # Här skulle man kunna använda OpenClaw/Claude för översättning
    # För nu, kopiera bara originalet och markera att översättning behövs
    cp audio.txt "$OUTPUT_BASE.txt"
    echo "[Översättning behövs från $DETECTED_LANG]" > "$OUTPUT_BASE.translation-needed.flag"
else
    # Svenska redan, kopiera direkt
    cp audio.txt "$OUTPUT_BASE.txt"
    cp audio.srt "$OUTPUT_BASE.srt"
fi

# Skapa metadata-fil
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio.m4a 2>/dev/null | cut -d. -f1)
cat > "$OUTPUT_BASE.meta" <<EOF
URL: $URL
Datum: $(date '+%Y-%m-%d %H:%M:%S')
Längd: ${DURATION}s
Språk: $DETECTED_LANG
Transkribering: Whisper (base model)
EOF

echo ""
echo "✅ Klar! Transkriptionen sparad:"
echo "📄 Original: $OUTPUT_BASE.original.txt"
if [ "$DETECTED_LANG" != "swedish" ] && [ "$DETECTED_LANG" != "sv" ]; then
    echo "🇸🇪 Översättning: $OUTPUT_BASE.txt (behöver manuell översättning)"
else
    echo "🇸🇪 Svenska: $OUTPUT_BASE.txt"
fi
echo "🎬 Undertext: $OUTPUT_BASE.original.srt"
echo "📋 Metadata: $OUTPUT_BASE.meta"
echo ""
echo "Förhandsgranskning:"
echo "─────────────────────────────────────"
head -n 20 "$OUTPUT_BASE.original.txt"
LINES=$(wc -l < "$OUTPUT_BASE.original.txt")
if [ "$LINES" -gt 20 ]; then
    echo "... ($((LINES - 20)) rader till)"
fi
echo "─────────────────────────────────────"

# Rensa temp
cd /
rm -rf "$WORK_DIR"

echo ""
echo "💾 Alla transkriptioner finns i: $TRANSCRIPTS_DIR"
echo ""
echo "📍 Sökväg att kopiera text från:"
echo "   $OUTPUT_BASE.txt"
