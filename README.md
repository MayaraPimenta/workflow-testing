## 🚀 Workflows do GitHub Actions

Este projeto utiliza vários workflows automatizados para facilitar o processo de desenvolvimento e release. Aqui está uma explicação simples do que cada um faz:

### 📝 **labeler.yml** - Etiquetador Automático de PRs
**O que faz:** Adiciona etiquetas (labels) automaticamente nos Pull Requests baseado no nome da branch.

**Quando executa:** Sempre que um PR é aberto, atualizado ou reaberto na branch `develop`.

**Como funciona:**
- Se a branch começa com `feature/` ou `feat/` → adiciona etiqueta "feature"
- Se a branch começa com `bugfix/` ou `fix/` → adiciona etiqueta "bugfix"  
- Se a branch começa com `refactor/` → adiciona etiqueta "refactor"
- Se a branch começa com `chore/` → adiciona etiqueta "chore"

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
**O que faz:** Cria automaticamente uma nova versão/release quando um PR é mergeado.

**Quando executa:** Quando um PR é fechado/mergeado na branch `master` ou `main`.

**Como funciona:**
1. **Adiciona etiqueta "release"** no PR mergeado
2. **Calcula a nova versão** baseado nas etiquetas do PR:
   - `major`/`breaking` → incrementa versão major (ex: 1.0.0 → 2.0.0)
   - `minor`/`feature` → incrementa versão minor (ex: 1.0.0 → 1.1.0) 
   - `patch`/`fix`/`bugfix` → incrementa versão patch (ex: 1.0.0 → 1.0.1)
3. **Gera release notes** automaticamente com base nos commits
4. **Cria a release no GitHub** com todas as informações

---

## 🔗 Como os Workflows Trabalham Juntos

1. **Desenvolvimento:** Você cria uma feature branch (`feature/sc-12345`)
2. **PR para develop:** O `labeler.yml` adiciona automaticamente a etiqueta "feature"
3. **PR para master:** O `updatePRName.yml` renomeia para `release-DD-MM-YY`
4. **Validação:** O `validatesPRSourceBranch.yml` confirma que o PR vem do `develop`
5. **Release:** O `newRelease.yml` cria automaticamente uma nova versão
6. **Hotfix:** Se necessário, o `syncBranches.yml` sincroniza as branches

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

---

## ⚠️ Importante
- **Sempre** inclua o número do ticket (`sc-XXXXX`) nas branches, PRs e no commit principal
- **Hotfixes** devem ser claramente identificados no título do PR
- **Branches de hotfix** são as únicas que podem ir diretamente para `master`/`main`
- **Todas as outras** funcionalidades devem passar por `develop` primeiro



## Decidir com equipe
### Configuração de proteções para branchs
- Main: Só aceita PR de develop ou hotfix
- Develop: Requer review

### Dúvidas
- É necessario criar job pra description na PR pra main ou a release cumpre essa tarefa?
- hotfix gera release?
- ideias pra formatação da documentação da release?