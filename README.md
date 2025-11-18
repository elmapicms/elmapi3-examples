# ElmapiCMS Examples

A collection of example projects demonstrating how to use [ElmapiCMS](https://elmapicms.com) features in different frameworks and scenarios.

## Examples

### Translations Examples

Examples demonstrating the translations feature, which allows you to link content entries across different locales.

- **[translations-nextjs-example](./translations-nextjs-example/)** - Next.js example with language switcher
- **[translations-nuxtjs-example](./translations-nuxtjs-example/)** - Nuxt.js example with language switcher

## Features Demonstrated

### Translations

The translations feature allows you to:
- Link content entries in the same collection across different locales
- Navigate between translated versions of content
- Use the API to fetch translated content using the `translation_locale` parameter

For more information, see the [Translations Documentation](https://docs.elmapicms.com/api/content-entries/translations/).

## Getting Started

Each example project includes its own README with setup instructions. Generally, you'll need to:

1. **Set up ElmapiCMS**: Ensure you have an ElmapiCMS instance running
2. **Create the example project**: Run the seeder to create the example project and content:
   ```bash
   php artisan db:seed --class=TranslationsExampleSeeder
   ```
3. **Configure the example**: Copy `.env.example` to `.env` and update with your ElmapiCMS configuration
4. **Install dependencies**: Run `npm install` in the example directory
5. **Run the example**: Start the development server (usually `npm run dev`)

## Project Structure

```
elmapi3-examples/
├── translations-nextjs-example/    # Next.js translations example
├── translations-nuxtjs-example/    # Nuxt.js translations example
└── README.md                       # This file
```

## Requirements

- Node.js 18+ 
- An ElmapiCMS instance (local or remote)
- The example project seeded in your ElmapiCMS database

## Contributing

Feel free to submit issues or pull requests if you'd like to add more examples or improve existing ones.

## License

These examples are provided as-is for demonstration purposes. Please refer to your ElmapiCMS license for usage terms.

