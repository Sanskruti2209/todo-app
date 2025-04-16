module.exports = {
    reporters: [
      'default',
      ['jest-junit', { outputFile: 'test-results.xml' }],
    ],
  };