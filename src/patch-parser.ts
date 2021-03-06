/**
 * Parse a string that represents a git patch
 * @param  {String} contents The contents of the patch to parse
 * @return {Object}          An object where the keys are filenames, and the
 * values are the contents of the diff
 */
export function parsePatch(contents) {
  const sha = contents.split(' ')[1];

  const message = /^Subject: \[.+?\] ([\S\s]+)?^---$/m.exec(contents)[1].trim().replace('\n', '');

  const fileParts = contents.split(/^diff --git /m).slice(1);
  const files = {};

  fileParts.forEach((part) => {
    const start = part.indexOf('@@');
    const diffContents = part.slice(start);

    // XXX won't work with spaces in filenames
    const fileNameMatch = /^\+\+\+ b\/(.+)$/m.exec(part);

    if (!fileNameMatch) {
      // This was probably a deleted file
      return;
    }

    const fileName = fileNameMatch[1];

    const fileData = parseUnifiedDiff(diffContents);

    files[fileName] = fileData;
  });

  return {
    files,
    sha,
    message
  };
}

export function parseMultiPatch(contents) {
  //contents = contents.replace(/\n[+-]{1}/g, '\n');
  const patchStart = /^From /gm;

  let match = patchStart.exec(contents);
  const patchIndices = [];

  while (match !== null) {
    patchIndices.push(match.index);
    match = patchStart.exec(contents);
  }

  const patches = [];
  patchIndices.forEach((_, i) => {
    let patchContent = '';

    if (i + 1 < patchIndices.length) {
      patchContent = contents.slice(patchIndices[i], patchIndices[i + 1]);
    } else {
      patchContent = contents.slice(patchIndices[i]);
    }

    // Remove the weird -- 2.2.1 part at the end of every patch
    patchContent = patchContent.split(/^-- $/m)[0];
    patches.push(patchContent);
  });

  return patches.map(parsePatch);
}

export function parseUnifiedDiff(diffContents) {
  const diffLines = diffContents.split('\n');

  // Take off the last line which is just empty
  const contentPatchLines: any[] = diffLines.slice(0, diffLines.length - 1);

  const parsedLines = contentPatchLines.map((line: any) => {
    if (!line) {
      // The last line ends up being an empty string
      return null;
    }

    if (/^@/.test(line)) {
      const lineNumberMatch = /^@@ -(\d+),?(\d+)? \+(\d+),?(\d+)? @@/.exec(line).map((str) => {
        return parseInt(str, 10);
      });

      return {
        type: 'lineNumbers',
        lineNumbers: {
          removed: {
            start: lineNumberMatch[1],
            lines: lineNumberMatch[2]
          },
          added: {
            start: lineNumberMatch[3],
            lines: lineNumberMatch[4]
          }
        }
      };
    }

    let type = 'context';

    if (/^\+/.test(line)) {
      type = 'added';
    } else if (/^-/.test(line)) {
      type = 'removed';
    }

    const content = line.slice(1);

    return {
      type,
      content: content
    };
  });

  // Now that we have parsed all of the lines, assemble them into sections that
  // have their own line number ranges
  const sections = [];
  let currSection;

  parsedLines.forEach((line: any) => {
    if (line !== null && line.content !== ' No newline at end of file') {
      if (line.type === 'lineNumbers') {
        if (currSection) {
          sections.push(currSection);
        }

        currSection = {
          lines: [],
          lineNumbers: line.lineNumbers
        };
      } else {
        currSection.lines.push(line);
      }
    }
  });

  sections.push(currSection);

  return sections;
}
