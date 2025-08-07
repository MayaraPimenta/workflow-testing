### Padrões
- Padrão de nomeação pra branch: feature/sc-12345, bugfix/sc-12345, etc.
- Padrão de nomeação de PR:
  [sc-12345] Something about the branch

  - Se for um hotfix, identifique de forma clara:
    [sc-12345] HOTFIX - Something about the branch ou HOTFIX - Something about the branch
- Padrão de nomeação de commits:
  - Último commit: [sc-12345] Something about the work
  - Commits anteriores: Something about the work

### Staging
- Ao criar PR para develop é adicionada label, baseada no nome da branch [feature, bugfix, refactor, chore]

### Production
- Adiciona label nova-release
- Cria arquivo de release, com nova versão, com commits na descrição e link do PR ao final
- Muda o nome da PR para release-mesatual-anoatual. Ex: release-07-2025

### DÚVIDAS
- É necessario criar job pra description na PR pra main ou a release cumpre essa tarefa?
- hotfix gera release?