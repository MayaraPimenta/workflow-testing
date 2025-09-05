## 🚀 Workflows do GitHub Actions

Este projeto utiliza vários workflows automatizados para facilitar o processo de desenvolvimento e release. Aqui está uma explicação simples do que cada um faz:

### 📝 **labeler.yml** - Etiquetador Automático de PRs
**O que faz:** Adiciona etiquetas (labels) automaticamente nos Pull Requests baseado no nome da branch e tipo de PR.

**Quando executa:** Sempre que um PR é aberto, atualizado ou reaberto nas branches `develop`, `master` ou `main`.

**Como funciona:**
- **Por tipo de branch:**
  - Se a branch começa com `feature/` ou `feat/` → adiciona etiqueta "feature"
  - Se a branch começa com `bugfix/` ou `fix/` → adiciona etiqueta "bugfix"  
  - Se a branch começa com `refactor/` → adiciona etiqueta "refactor"
  - Se a branch começa com `chore/` → adiciona etiqueta "chore"
  - Se a branch começa com `hotfix/` → adiciona etiqueta "hotfix"

- **Por tipo de PR:**
  - PR de `main`/`master` para `develop` → adiciona etiqueta "hotfix-synced"
  - PR de `develop` para `master`/`main` → adiciona etiqueta "release"

---

### 🧪 **featureToDevelop.yml** - PR Automático Feature para Develop
**O que faz:** Cria automaticamente um PR da branch feature para develop após aprovação pelos testers na branch test.

**Quando executa:** Quando um PR é fechado/mergeado na branch `test`.

**Como funciona:**
1. Detecta quando um PR é mergeado na branch `test`
2. Verifica se já existe um PR aberto da mesma branch para `develop`
3. Se não existir, cria automaticamente um novo PR:
   - **Título:** `Auto PR: [nome-da-branch] -> develop`
   - **Descrição:** Inclui informações do PR original (título e descrição)
   - **Branch origem:** A mesma branch que foi mergeada na test
   - **Branch destino:** develop
4. Registra logs detalhados do processo

**Benefícios:**
- Automatiza o fluxo de aprovação: feature → test → develop
- Mantém o histórico das mudanças originais
- Evita duplicação de PRs
- Facilita o processo de revisão pelos testers

---

### 🔄 **syncBranches.yml** - Sincronização de Branches
**O que faz:** Sincroniza automaticamente as branches após um hotfix ser mergeado.

**Quando executa:** Quando um PR é fechado/mergeado na branch `master` ou `main`.

**Como funciona:**
1. Se o PR mergeado vem de uma branch `hotfix/*`, adiciona a etiqueta "hotfix"
2. Cria automaticamente um novo PR para sincronizar `master` → `develop`
3. Isso garante que os hotfixes sejam propagados para a branch de desenvolvimento

---

### 🏷️ **updatePRName.yml** - Atualização do Nome do PR
**O que faz:** Renomeia automaticamente PRs para seguir o padrão de release.

**Quando executa:** Quando um PR é aberto para as branches `master` ou `main` (exceto hotfixes).

**Como funciona:**
- Muda o título do PR para o formato: `release-DD-MM-YY`
- Usa a data atual do sistema
- Exemplo: `release-08-08-25`

---

### ✅ **validatesPRSourceBranch.yml** - Validação de Branch de Origem
**O que faz:** Valida se o PR está vindo de uma branch permitida.

**Quando executa:** Sempre que um PR é aberto para `main` ou `master`.

**Como funciona:**
- ✅ **Aceita PRs vindos de:** `develop` ou branches que começam com `hotfix`
- ❌ **Rejeita PRs vindos de:** qualquer outra branch
- Se inválido, adiciona um comentário explicativo no PR e falha o workflow

---

### 🎯 **newRelease.yml** - Criação Automática de Release
**O que faz:** Cria automaticamente uma nova versão/release quando um PR é mergeado, usando a versão do package.json.

**Quando executa:** Quando um PR é fechado/mergeado na branch `master` ou `main`.

**Como funciona:**
1. **Obtém a versão** diretamente do package.json (já atualizada pelo versionBump.yml)
2. **Analisa os commits do PR** para gerar release notes:
   - Para PRs diretos: usa o último commit como título principal
   - Para PRs com merges: processa cada branch mergeada separadamente
   - Filtra commits de "bump version" automaticamente
3. **Gera release notes estruturadas** com:
   - Commit principal em destaque
   - Outros commits como bullet points
   - Informações do PR (número, branch origem/destino)
4. **Cria a release no GitHub** com todas as informações formatadas
5. **Gera resumo** no workflow com detalhes da release

---

### 📦 **versionBump.yml** - Atualização Automática de Versão no PR
**O que faz:** Atualiza automaticamente a versão no package.json quando um PR é aberto para master/main.

**Quando executa:** Sempre que um PR é aberto, sincronizado ou reaberto para as branches `master` ou `main`.

**Como funciona:**
1. **Valida a branch de origem** (deve ser `develop` ou `hotfix/*`)
2. **Obtém a versão atual** do último git tag e do package.json
3. **Usa a versão mais alta** como base para o cálculo
4. **Determina o tipo de incremento** baseado nas etiquetas do PR:
   - `major`/`breaking` → incrementa versão major (ex: 1.0.0 → 2.0.0)
   - `minor`/`feature` → incrementa versão minor (ex: 1.0.0 → 1.1.0)
   - Padrão → incrementa versão patch (ex: 1.0.0 → 1.0.1)
5. **Atualiza o package.json** com a nova versão
6. **Faz commit automático** da mudança na branch do PR

---

## 🔗 Como os Workflows Trabalham Juntos

1. **Desenvolvimento:** Você cria uma feature branch (`feature/sc-12345`)
2. **PR para test:** A feature é enviada para a branch `test`
3. **PR Automático:** O `featureToDevelop.yml` cria automaticamente um PR da feature para `develop`
4. **Aprovação e Merge:** Se aprovado pelos testers, o PR criado é mergeado na `develop`
5. **PR para master:** 
   - O `updatePRName.yml` renomeia para `release-DD-MM-YY`
   - O `versionBump.yml` atualiza automaticamente a versão no package.json
6. **Validação:** O `validatesPRSourceBranch.yml` confirma que o PR vem do `develop`
7. **Merge e Release:** O `newRelease.yml` cria automaticamente uma nova versão usando a versão do package.json
8. **Hotfix:** Se necessário, o `syncBranches.yml` sincroniza as branches
9. **Sincronização de Hotfix:** O `labeler.yml` adiciona etiqueta "hotfix-synced" em PRs de master→develop

### 🔄 Fluxo Detalhado por Cenário

**📈 Fluxo Normal (Feature → Test → Develop → Release):**
1. `feature/sc-12345` → PR para `test` (para aprovação dos testers)
2. Merge na `test` → `featureToDevelop.yml` cria PR automático para `develop`
3. `develop` → PR para `master` (updatePRName + versionBump + validação)
4. Merge → newRelease cria release automática

**🚨 Fluxo de Hotfix:**
1. `hotfix/sc-67890` → PR direto para `master` (labeler adiciona "hotfix")
2. Merge → newRelease cria release + syncBranches abre PR master→develop
3. PR de sincronização → labeler adiciona "hotfix-synced"

**🏷️ Sistema de Labels Automático:**
- **Por branch:** feature, bugfix, refactor, chore, hotfix
- **Por tipo de PR:** release (develop→master), hotfix-synced (master→develop)
- **Para versionamento:** major, minor, patch (controlam o tipo de release)

---

## 📋 Padrões e Convenções

### 🌿 Padrão de Nomeação para Branches
Todas as branches devem seguir o formato: `tipo/sc-XXXXX`

**Exemplos:**
- `feature/sc-12345` - para novas funcionalidades
- `bugfix/sc-12345` - para correções de bugs  
- `refactor/sc-12345` - para refatorações
- `chore/sc-12345` - para tarefas de manutenção
- `hotfix/sc-12345` - para correções urgentes em produção

### 📝 Padrão de Nomeação para Pull Requests
- **Formato padrão:** `[sc-12345] Something about the branch`
- **Para hotfixes, identifique claramente:**
  - `[sc-12345] HOTFIX - Something about the branch`
  - `HOTFIX - Something about the branch`

**Exemplos:**
- `[sc-12345] Implements auth via OAuth`
- `[sc-67890] HOTFIX - Fix critical login failure`
- `HOTFIX - Fix API performance issue`

### 💬 Padrão de Nomeação para Commits
- **Último commit (principal):** `[sc-12345] This is the last commit`
- **Commits anteriores:** `Commit before the last`

**Exemplos:**
- `[sc-12345] Implements form validation` ← commit principal
- `Add unit testing` ← commits anteriores
- `Fix CSS style`
- `Updates documentation`

### 🏷️ Labels para Controle de Versionamento
Use estas etiquetas nos PRs para controlar o tipo de release:
- `major` ou `breaking` - mudanças que quebram compatibilidade
- `minor` ou `feature` - novas funcionalidades
- `patch`, `fix` ou `bugfix` - correções de bugs

### 🧪 **Nova Branch Test**
A branch `test` foi introduzida como uma etapa intermediária no fluxo de desenvolvimento:
- **Propósito:** Permitir que os testers aprovem as funcionalidades antes de irem para develop
- **Fluxo:** feature → test (aprovação) → develop (automático) → master
- **Benefícios:** 
  - Maior controle de qualidade
  - Separação clara entre desenvolvimento e teste
  - Automação do processo pós-aprovação

---

## ⚠️ Importante
- **Sempre** inclua o número do ticket (`sc-XXXXX`) nas branches, PRs e no commit principal
- **Hotfixes** devem ser claramente identificados no título do PR
- **Branches de hotfix** são as únicas que podem ir diretamente para `master`/`main`
- **Features** devem passar pelo fluxo: feature → test → develop → master
- **Branch test** é usada para aprovação pelos testers antes do merge automático para develop
- **Todas as outras** funcionalidades devem passar por `develop` primeiro

## TO-DO
- Regras para branches: Subir mudanças apenas por PR