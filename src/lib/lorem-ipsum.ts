export type GenerationMode = 'paragraphs' | 'sentences' | 'words'

export interface GenerateOptions {
  mode: GenerationMode
  count: number
  startWithLorem: boolean
  includeHtmlTags: boolean
}

const GENERATION_MODES: GenerationMode[] = ['paragraphs', 'sentences', 'words']

const LOREM_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
const LOREM_WORDS = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet']

const WORD_BANK: string[] = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'accumsan',
  'aliquam',
  'aliquet',
  'ante',
  'arcu',
  'auctor',
  'augue',
  'bibendum',
  'blandit',
  'congue',
  'convallis',
  'cras',
  'curabitur',
  'cursus',
  'dapibus',
  'dictum',
  'dignissim',
  'donec',
  'efficitur',
  'egestas',
  'eget',
  'eleifend',
  'elementum',
  'eros',
  'euismod',
  'facilisis',
  'faucibus',
  'felis',
  'fermentum',
  'feugiat',
  'finibus',
  'fringilla',
  'fusce',
  'gravida',
  'hendrerit',
  'iaculis',
  'imperdiet',
  'interdum',
  'justo',
  'lacinia',
  'lectus',
  'leo',
  'libero',
  'ligula',
  'litora',
  'lobortis',
  'luctus',
  'maecenas',
  'malesuada',
  'massa',
  'mattis',
  'maximus',
  'metus',
  'mi',
  'molestie',
  'mollis',
  'montes',
  'morbi',
  'nam',
  'natoque',
  'nec',
  'neque',
  'netus',
  'nibh',
  'nostra',
  'nullam',
  'nunc',
  'odio',
  'ornare',
  'pellentesque',
  'phasellus',
  'platea',
  'posuere',
  'potenti',
  'praesent',
  'pretium',
  'proin',
  'pulvinar',
  'purus',
  'quam',
  'quisque',
  'rhoncus',
  'risus',
  'rutrum',
  'sagittis',
  'sapien',
  'scelerisque',
  'sem',
  'semper',
  'senectus',
  'sociis',
  'sollicitudin',
  'suscipit',
  'suspendisse',
  'taciti',
  'tellus',
  'tincidunt',
  'tortor',
  'tristique',
  'turpis',
  'ullamcorper',
  'ultricies',
  'urna',
  'varius',
  'vehicula',
  'vel',
  'venenatis',
  'vestibulum',
  'vitae',
  'vivamus',
  'viverra',
  'volutpat',
  'vulputate',
]

const isGenerationMode = (value: unknown): value is GenerationMode =>
  typeof value === 'string' && GENERATION_MODES.includes(value as GenerationMode)

const validateOptions = (options: GenerateOptions) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Please provide generation options.')
  }

  const { mode, count, startWithLorem, includeHtmlTags } = options as Partial<GenerateOptions>

  if (!isGenerationMode(mode)) {
    throw new Error('Please choose a valid generation mode.')
  }

  if (!Number.isInteger(count) || Number(count) <= 0) {
    throw new Error('Please provide a count greater than 0.')
  }

  if (typeof startWithLorem !== 'boolean') {
    throw new Error('Please specify whether to start with Lorem.')
  }

  if (typeof includeHtmlTags !== 'boolean') {
    throw new Error('Please specify whether to include HTML tags.')
  }
}

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomWord = () => WORD_BANK[randomInt(0, WORD_BANK.length - 1)]

const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

const generateRandomSentence = () => {
  const wordCount = randomInt(8, 15)
  const words = Array.from({ length: wordCount }, () => randomWord()).join(' ')
  return `${capitalizeFirstLetter(words)}.`
}

const generateSentences = (count: number, startWithLorem: boolean) => {
  const sentences: string[] = []

  if (startWithLorem) {
    sentences.push(LOREM_SENTENCE)
  }

  while (sentences.length < count) {
    sentences.push(generateRandomSentence())
  }

  return sentences
}

const generateParagraphs = (count: number, startWithLorem: boolean) => {
  const paragraphs: string[] = []

  for (let index = 0; index < count; index += 1) {
    const sentenceCount = randomInt(4, 8)
    const sentences: string[] = []

    if (index === 0 && startWithLorem) {
      sentences.push(LOREM_SENTENCE)
    }

    while (sentences.length < sentenceCount) {
      sentences.push(generateRandomSentence())
    }

    paragraphs.push(sentences.join(' '))
  }

  return paragraphs
}

const generateWords = (count: number, startWithLorem: boolean) => {
  const words: string[] = []

  if (startWithLorem) {
    words.push(...LOREM_WORDS)
  }

  while (words.length < count) {
    words.push(randomWord())
  }

  return words.slice(0, count)
}

export const generateLoremIpsum = (options: GenerateOptions): string => {
  validateOptions(options)

  const { mode, count, startWithLorem, includeHtmlTags } = options

  if (mode === 'words') {
    const words = generateWords(count, startWithLorem).join(' ')
    return includeHtmlTags ? `<p>${words}</p>` : words
  }

  if (mode === 'sentences') {
    const sentences = generateSentences(count, startWithLorem).map((sentence) =>
      includeHtmlTags ? `<span>${sentence}</span>` : sentence,
    )
    return sentences.join(' ')
  }

  const paragraphs = generateParagraphs(count, startWithLorem).map((paragraph) =>
    includeHtmlTags ? `<p>${paragraph}</p>` : paragraph,
  )

  return paragraphs.join('\n\n')
}
