
## Installazione Database
Per poter eseguire l'applicativo ci serve un database sul quale lavorare. Nello specifico un qualsiasi database che usi un dialetto di sql (mysql, mariadb, etc... Per comodità ho usato mysql negli esempi). Per creare il db possiamo procedere tamite comandi (terminale):
```shell
mysql -u nomeutente -p
```
Al posto di *nomeutente* bisogna inserire il nome dell'utente ad esempio:
```shell
mysql -u root -p
```
Dopo di che vi verrà chiesto di inserire la password per quell'utente. Se non ricordate la password o il nome utente potete resettarli seguendo una guida online (<a href= https://www.andreaminini.com/linux/mysql/reset-password-root-mysql-mariadb-linux>linux</a>, <a href=https://dev.mysql.com/doc/mysql-windows-excerpt/8.0/en/resetting-permissions-windows.html>windows</a>).
Una volta nella shell di sql, basta creare il database scegliendo un nome a piacere:
```sql
CREATE DATABASE nomedatabase;
```
E il gioco è fatto. Ora resta da [configurare il back-end](Back-end.md#configurazione-di-sequelize).

## Struttura del Database

![Database parziale](assets/PartialDB.png)
Schema attuale del database. Le lettere delle tabelle sono in PascalCase, mentre il nome delle feature è in snake case, tranne i parametri generati in automatico come createdAt e updatedAt che sfruttano il camelCase. Notazioni di scrittura: ![Notazioni di scrittura del codice](assets/NotazioniDiScrittura.png)

