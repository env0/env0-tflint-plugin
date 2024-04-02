#!/bin/bash

# Function to compare semantic versions
# Returns 0 if first version is greater or equal, 1 otherwise
compare_versions() {
  if [[ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" == "$1" ]]; then return 0; else return 1; fi
}

# Convert inputs.version to a standard format if it starts with 'v'
TFLINT_VERSION=${TFLINT_VERSION#v}

if [ "${TFLINT_VERSION}" == "latest" ]; then echo "This plugin requires a specific tflint version" && exit 2; fi

mkdir -p "${TFLINT_INSTALL_PATH}"
curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | sed 's/unzip -u/unzip -o/' | bash

tflint --init

# If TFLINT_VERSION is greater or equal to 0.44.0 (https://github.com/terraform-linters/tflint/releases/tag/v0.44.0)
# then use the --chdir flag, otherwise use the directory as the last argument
if compare_versions "0.44.0" "$TFLINT_VERSION"; then
  tflint "${TFLINT_FLAGS}" --chdir="${TFLINT_DIRECTORY}"
else
  tflint "${TFLINT_FLAGS}" "${TFLINT_DIRECTORY}"
fi
