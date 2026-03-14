#!/bin/bash

set -e

echo "Building Vaani Tauri app for all targets..."

DOCKER_IMAGE="vaani-tauri-builder"
DOCKERFILE="Dockerfile.tauri"
OUTPUT_DIR="src-tauri/target/release/bundle"
BINARY_DIR="src-tauri/target/release"

mkdir -p "$OUTPUT_DIR/linux-x64"
mkdir -p "$OUTPUT_DIR/windows-x64"
mkdir -p "$OUTPUT_DIR/linux-arm64"

echo "Building Linux x64..."
docker build --build-arg TARGET=x86_64-unknown-linux-gnu -t "${DOCKER_IMAGE}:linux-x64" -f "$DOCKERFILE" .
docker run --rm -v "$(pwd)/${OUTPUT_DIR}/linux-x64:/output" "${DOCKER_IMAGE}:linux-x64" \
    sh -c "cp -r src-tauri/target/release/bundle/* /output/ 2>/dev/null || true"

echo "Building Windows x64..."
docker build --build-arg TARGET=x86_64-pc-windows-gnu -t "${DOCKER_IMAGE}:windows-x64" -f "$DOCKERFILE" .
docker run --rm -v "$(pwd)/${OUTPUT_DIR}/windows-x64:/output" "${DOCKER_IMAGE}:windows-x64" \
    sh -c "cp -r src-tauri/target/release/bundle/* /output/ 2>/dev/null || true"
docker run --rm -v "$(pwd)/${BINARY_DIR}:/output" "${DOCKER_IMAGE}:windows-x64" \
    sh -c "cp src-tauri/target/release/app.exe /output/ 2>/dev/null || cp src-tauri/target/release/*.exe /output/ 2>/dev/null || true"

echo "Building Linux ARM64..."
docker build --build-arg TARGET=aarch64-unknown-linux-gnu -t "${DOCKER_IMAGE}:linux-arm64" -f "$DOCKERFILE" .
docker run --rm -v "$(pwd)/${OUTPUT_DIR}/linux-arm64:/output" "${DOCKER_IMAGE}:linux-arm64" \
    sh -c "cp -r src-tauri/target/release/bundle/* /output/ 2>/dev/null || true"

echo "All builds complete!"
echo ""
echo "Output structure:"
echo "  linux-x64/    - AppImage, deb, rpm"
echo "  windows-x64/  - exe (NSIS requires Windows host)"
echo "  linux-arm64/  - AppImage"
echo ""
echo "Windows .exe location: $BINARY_DIR/app.exe"
