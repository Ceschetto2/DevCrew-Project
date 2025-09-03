## Prerequisiti
L'intero progetto e replicabile su qualsiasi dispositivo e con qualsiasi sistema operativo. Ogni software usato è gratuito in quanto si basa su librerie open-source, principalmente <a href = "https://react.dev/">react</a>. 

<a href = "https://react.dev/">React</a> è una libreria di **javascript**, un linguaggio interpretato nell'ambiente <a href="https://nodejs.org/en">NodeJS</a>.
Quindi i prerequisiti per lo sviluppo di questo software sono:
- **NodeJS**.
- **npm**: Un gestore pacchetti per javascript che consente l'installazione facilitata di librerie.
<a href="https://nodejs.org/en/download">Guida per l'installazione.</a>
Inoltre è necessario un qualsiasi ide o editor di testo per lo sviluppo (va bene anche notepad, ma è fortemente sconsigliato). Io personalmente utilizzo <a href="https://code.visualstudio.com/">VScode</a> che, tramite estensioni, consente di sviluppare in qualsiasi linguaggio e integra tutti i principali strumenti di sviluppo come <a href="https://git-scm.com/">Git</a>.

## Passi da eseguire per installare l'applicazione.

1. Clonare la repository:

```bash

git clone https://github.com/Ceschetto2/RMS

```
2. Partiamo con l'**installazione del** [front-end](Front-end.md). Spostiamoci nella cartella react:

```bash

cd react

```

3. Installare i moduli necessari utilizzati nel progetto, specificati nel package.json:

```bash

npm install

```

4. Avviare il programma:

```bash

npm run dev

```

Di default il programma si avvierà sulla porta 5173 in localhost: http://localhost:5173/
Ogni qualvolta che si modifica un file e lo si salva, le modifiche vengono automaticamente aggiornate sul sito in localhost.

Ora passiamo all'**installazione del back-end**. L'installazione inizia in modo analogo a quella del [front-end](Front-end.md): 

1. Spostiamoci nella cartella del back-end (partendo dalla cartella root del progetto):

```bash

cd backend-serv

```
2. Installare i moduli necessari utilizzati nel progetto, specificati nel package.json:

```bash

npm install

```

Il [back-end](Back-end.md) fa uso del [Database](Database.md) e per questo dobbiamo procedere con la creazione di questultimo e la configurazione della libreria che ci consente il collegamento.
1. [Installazione database](Database.md#installazione-database)
2. [Configurazione Back-end](Back-end.md#configurazione-di-sequelize)

Ora ci resta da eseguire il [back-end](Back-end.md):
```bash

npm run dev

```
E il gioco è fatto.

