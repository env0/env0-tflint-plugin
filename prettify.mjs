import {readFile, writeFile} from 'node:fs/promises';
import process from 'node:process';

const colorCode = {
    error: '\x1b[31m',
    warning: '\x1b[33m',
    notice: '\x1b[90m',
    reset: '\x1b[0m',
};

const icons = {
    error: '❌',
    warning: '⚠️',
    notice: '🔍',
};

const readFileLines = (fileName, startLine, endLine) => {
    return readFile(fileName, 'utf-8')
        .then((content) => content.split('\n').slice(startLine - 1, endLine).join('\n'))
        .catch(() => '');
}

(async () => {
    const tfLintJson = JSON.parse(await readFile('tflint.json', 'utf-8'));

    const counts = tfLintJson.issues.reduce((acc, issue) => {
        const severity = issue.rule.severity;
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});

    const summary = Object.entries(counts)
        .map(([severity, count]) => `${colorCode[severity]}${count} ${severity}${colorCode.reset}`)
        .join(' / ');

    await writeFile(process.env.ENV0_STEP_SUMMARY, summary);

    const issuesWithContent = await Promise.all(tfLintJson.issues.map(async (issue) => {
        if (issue.range.filename) {
            issue.content = await readFileLines(issue.range.filename, issue.range.start.line, issue.range.end.line);
        }
        return issue;
    }));

    const issues = issuesWithContent.map((issue) => {
        const {
            rule: {severity, link},
            message,
            range: {filename, start: {line: start}, end: {line: end}},
            content
        } = issue;
        return [
            `## [${message}](${link}) ${icons[severity]}`,
            filename ? `### File \`${filename}\` - ` + (start === end ? `line ${start}` : `lines ${start} - ${end}`) : undefined,
            content ? '```hcl\n' + content + '\n```' : undefined,
        ]
            .filter(l => l)
            .join('\n');
    });

    await writeFile(process.env.ENV0_STEP_CONTENT, issues.join('\n\n'));
})();