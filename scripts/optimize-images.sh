#!/bin/bash
# One-time image optimization for Lighthouse performance
# Uses macOS built-in `sips` to resize PNGs/JPGs in-place
# Logo wall displays at 48px height (CSS), so 200px max covers 4x retina
# Headshots display at 48px in tooltips, so 128px covers 2.5x retina

set -e

PROJ_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGOS_DIR="$PROJ_ROOT/assets/logos"
HEADSHOTS_DIR="$PROJ_ROOT/assets/headshots"

MAX_LOGO_DIM=200    # max width or height for logos
MAX_HEADSHOT_DIM=128 # max width or height for headshots

echo "=== Optimizing logos (max ${MAX_LOGO_DIM}px) ==="
for img in "$LOGOS_DIR"/*.png "$LOGOS_DIR"/*.jpg; do
  [ -f "$img" ] || continue
  w=$(sips -g pixelWidth "$img" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$img" 2>/dev/null | awk '/pixelHeight/{print $2}')
  if [ "$w" -gt "$MAX_LOGO_DIM" ] || [ "$h" -gt "$MAX_LOGO_DIM" ]; then
    echo "  Resizing: $(basename "$img") (${w}x${h})"
    sips --resampleHeightWidthMax "$MAX_LOGO_DIM" "$img" >/dev/null 2>&1
  else
    echo "  OK: $(basename "$img") (${w}x${h})"
  fi
done

echo ""
echo "=== Optimizing headshots (max ${MAX_HEADSHOT_DIM}px) ==="
for img in "$HEADSHOTS_DIR"/*.png "$HEADSHOTS_DIR"/*.jpg; do
  [ -f "$img" ] || continue
  w=$(sips -g pixelWidth "$img" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$img" 2>/dev/null | awk '/pixelHeight/{print $2}')
  if [ "$w" -gt "$MAX_HEADSHOT_DIM" ] || [ "$h" -gt "$MAX_HEADSHOT_DIM" ]; then
    echo "  Resizing: $(basename "$img") (${w}x${h})"
    sips --resampleHeightWidthMax "$MAX_HEADSHOT_DIM" "$img" >/dev/null 2>&1
  else
    echo "  OK: $(basename "$img") (${w}x${h})"
  fi
done

echo ""
echo "=== Before/After sizes ==="
echo "Logos:     $(du -sh "$LOGOS_DIR" | awk '{print $1}')"
echo "Headshots: $(du -sh "$HEADSHOTS_DIR" | awk '{print $1}')"
echo "Done!"
