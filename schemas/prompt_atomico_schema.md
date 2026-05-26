# Schema: Prompt Atômico (Vibe Coding)

Este schema dita a estrutura rígida de comunicação com IAs de código (Claude, Gemini, etc.) no fluxo do Totum OS.

## Template

```markdown
## CONTEXTO
- **Arquivo:** `caminho/relativo/ao/projeto`
- **Estado atual:** [Descrição em 1-2 frases]
- **Dependências relevantes:** [imports, serviços externos, hooks existentes]

## INTENÇÃO
- [Descrição precisa da ÚNICA mudança desejada]
- [Por que esta mudança é necessária — raciocínio de negócio]

## RESTRIÇÕES
- [O que NÃO deve ser modificado, ex: Manter CSS intacto]
- [Padrões de código a seguir, ex: Strict Mode, Clean Architecture, Padrão de Hook]
- [Considerações de performance ou segurança]

## CRITÉRIO DE SUCESSO
- [Como verificar que a mudança funciona — passo a passo para teste manual]
- [Comportamento observável que indica sucesso]
```

## Exemplo Prático (Aplicado em Checkout)

```markdown
## CONTEXTO
Arquivo: `src/components/checkout/CheckoutForm.tsx`
Estado atual: Componente exibe nome e email, sem validação
Dependências: usa `useAuth` do módulo `@/auth`, chama `/api/checkout`

## INTENÇÃO
Adicionar validação de formulário usando React Hook Form, com:
- Email: formato válido, obrigatório
- CEP: 8 dígitos, validação assíncrona via ViaCEP
- Número do cartão: validação de algoritmo de Luhn (apenas frontend)

## RESTRIÇÕES
- NÃO modificar a estrutura visual do formulário (CSS mantido)
- NÃO implementar submissão real — apenas validação
- Manter compatibilidade com TypeScript strict mode
- Usar `react-hook-form` v7+ com `zod` para schema

## CRITÉRIO DE SUCESSO
- Teste manual: submit com campos vazios mostra erros específicos por campo
- Teste manual: email "invalido" mostra erro "Formato de email inválido"
- Teste manual: CEP "00000000" mostra erro "CEP não encontrado" após consulta
- Teste unitário: função de validação de Luhn retorna true para "4532015112830366"
```
