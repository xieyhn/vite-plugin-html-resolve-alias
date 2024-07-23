// @ts-check
import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    typescript: true,
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
)
