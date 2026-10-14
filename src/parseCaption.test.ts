import { describe, expect, it } from 'vitest';
import { looksLikeRecipe, parseCaption } from './parseCaption';

describe('parseCaption', () => {
  it('reads an English caption with headed sections, emoji and hashtags', () => {
    const caption = `🍋 Creamy lemon orzo! 🍋
Ready in 20 min and serves 2 ✨

Ingredients:
- 200 g orzo
- 1 tbsp butter
- 1 garlic clove, grated
- 600 ml vegetable stock

Method:
1. Melt the butter and fry the garlic for 30 seconds.
2. Add the orzo and toast for 1 minute.
3. Pour in the stock bit by bit, stirring, until tender.

#orzo #dinnerideas #easyrecipes`;
    const r = parseCaption(caption);
    expect(r.title).toBe('Creamy lemon orzo');
    expect(r.time).toBe('20 min');
    expect(r.servings).toBe('2');
    expect(r.ingredients).toEqual(['200 g orzo', '1 tbsp butter', '1 garlic clove, grated', '600 ml vegetable stock']);
    expect(r.steps).toEqual([
      'Melt the butter and fry the garlic for 30 seconds.',
      'Add the orzo and toast for 1 minute.',
      'Pour in the stock bit by bit, stirring, until tender.',
    ]);
  });

  it('reads a Portuguese caption (Ingredientes / Modo de preparo / Rende)', () => {
    const caption = `Brigadeiro de colher 🍫
Rende: 6 potinhos

Ingredientes
• 1 lata de leite condensado
• 1 colher de sopa de manteiga
• 3 colheres de sopa de chocolate em pó

Modo de preparo
1) Leve tudo ao fogo baixo, mexendo sempre.
2) Cozinhe por 10 minutos até engrossar.
3) Sirva em potinhos.
#brigadeiro #docebrasileiro`;
    const r = parseCaption(caption);
    expect(r.title).toBe('Brigadeiro de colher');
    expect(r.servings).toBe('6 potinhos');
    expect(r.time).toBe(''); // the as-is parser doesn't know "minutos"
    expect(r.ingredients).toEqual([
      '1 lata de leite condensado',
      '1 colher de sopa de manteiga',
      '3 colheres de sopa de chocolate em pó',
    ]);
    expect(r.steps).toEqual([
      'Leve tudo ao fogo baixo, mexendo sempre.',
      'Cozinhe por 10 minutos até engrossar.',
      'Sirva em potinhos.',
    ]);
  });

  it('works without headings, using quantities and numbered lines', () => {
    const caption = `The easiest garlic noodles you'll ever make
Takes 15 mins, makes 2 bowls
200g egg noodles
4 garlic cloves
2 tbsp soy sauce
A splash of sesame oil
1. Cook the noodles.
2. Fry the garlic in butter until golden.
3. Toss everything together.`;
    const r = parseCaption(caption);
    expect(r.title).toBe("The easiest garlic noodles you'll ever make");
    expect(r.time).toBe('15 mins');
    expect(r.servings).toBe('2 bowls');
    expect(r.ingredients).toEqual(['200g egg noodles', '4 garlic cloves', '2 tbsp soy sauce', 'A splash of sesame oil']);
    expect(r.steps).toEqual(['Cook the noodles.', 'Fry the garlic in butter until golden.', 'Toss everything together.']);
  });

  it('handles "You\'ll need" / "Steps" headings and "Step 1:" numbering', () => {
    const caption = `Iced matcha latte 🍵
Serves 1
You'll need:
1 tsp matcha
60 ml hot water
200 ml oat milk
Ice
Steps:
Step 1: Whisk the matcha with the hot water.
Step 2: Fill a glass with ice and milk.
Step 3: Pour the matcha over the top.`;
    const r = parseCaption(caption);
    expect(r.title).toBe('Iced matcha latte');
    expect(r.servings).toBe('1');
    expect(r.ingredients).toEqual(['1 tsp matcha', '60 ml hot water', '200 ml oat milk', 'Ice']);
    expect(r.steps).toEqual([
      'Whisk the matcha with the hot water.',
      'Fill a glass with ice and milk.',
      'Pour the matcha over the top.',
    ]);
  });

  it('returns nothing useful for empty or hashtag-only text', () => {
    expect(looksLikeRecipe(parseCaption(''))).toBe(false);
    expect(looksLikeRecipe(parseCaption('#food #yum\n#cooking'))).toBe(false);
  });
});
