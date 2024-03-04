import fs from 'fs/promises';

const colorCode = {
    error: '\x1b[31m',
    warning: '\x1b[33m',
    notice: '\x1b[90m',
    reset: '\x1b[0m',
};

(async () => {
    const tfLintJson = JSON.parse(await fs.readFile('tflint.json', 'utf-8'));

    const counts = tfLintJson.issues.reduce((acc, issue) => {
        const severity = issue.rule.severity;
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {});

    const summary = Object.entries(counts)
        .map(([severity, count]) => `${colorCode[severity]}${count} ${severity}${colorCode.reset}`)
        .join(' / ');

    await fs.writeFile(proccess.env.ENV0_STEP_SUMMARY, summary);

    const issues = tfLintJson.issues.map((issue) => {
        const {rule: {severity, link}, message, range: {filename, start: {line: start}, end: {line: end}}} = issue;
        return [
            `### ${severity}: [${message}](${link})`,
            filename ? `File: ${filename}` : undefined,
            filename ? (start === end ? `Line ${start}` : `Lines ${start} - ${end}`) : undefined,
        ]
            .filter(l => l)
            .join('\n');
    });

    await fs.writeFile(proccess.env.ENV0_STEP_CONTENT, issues.join('\n\n'));
})();