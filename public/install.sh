#!/bin/sh
# toq protocol installer
# Usage: curl -sSf https://raw.githubusercontent.com/toqprotocol/toq/main/install.sh | sh
set -e

REPO="toqprotocol/toq"
INSTALL_DIR="${TOQ_INSTALL_DIR:-$HOME/.toq/bin}"

detect_target() {
  OS=$(uname -s)
  ARCH=$(uname -m)

  case "$OS" in
    Linux)  OS_TARGET="unknown-linux-gnu" ;;
    Darwin) OS_TARGET="apple-darwin" ;;
    *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
  esac

  case "$ARCH" in
    x86_64|amd64)  ARCH_TARGET="x86_64" ;;
    aarch64|arm64) ARCH_TARGET="aarch64" ;;
    *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
  esac

  echo "${ARCH_TARGET}-${OS_TARGET}"
}

get_latest_version() {
  curl -s "https://api.github.com/repos/$REPO/releases" | \
    grep -m1 '"tag_name"' | sed 's/.*"tag_name": *"//;s/".*//'
}

main() {
  TARGET=$(detect_target)
  VERSION=$(get_latest_version)

  if [ -z "$VERSION" ]; then
    echo "Failed to determine latest version" >&2
    exit 1
  fi

  URL="https://github.com/$REPO/releases/download/$VERSION/toq-$VERSION-$TARGET.tar.gz"

  echo "Installing toq $VERSION ($TARGET)"
  echo "  from: $URL"
  echo "  to:   $INSTALL_DIR/toq"

  mkdir -p "$INSTALL_DIR"

  TMPDIR=$(mktemp -d)
  trap 'rm -rf "$TMPDIR"' EXIT

  curl -sL "$URL" -o "$TMPDIR/toq.tar.gz"
  tar xzf "$TMPDIR/toq.tar.gz" -C "$TMPDIR"
  cp "$TMPDIR"/toq-*/toq "$INSTALL_DIR/toq"
  chmod +x "$INSTALL_DIR/toq"

  echo ""
  echo "toq $VERSION installed to $INSTALL_DIR/toq"

  case ":$PATH:" in
    *":$INSTALL_DIR:"*) ;;
    *)
      echo ""
      echo "Add toq to your PATH:"
      echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
      echo ""
      echo "To make it permanent, add that line to ~/.bashrc or ~/.zshrc"
      ;;
  esac
}

main
