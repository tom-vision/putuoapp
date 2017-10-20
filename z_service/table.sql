drop table linkers;
create table if not exists linkers (
    id         INTEGER NOT NULL
               PRIMARY KEY autoincrement,
    name       TEXT    NOT NULL
                       DEFAULT '',
    img        TEXT    NOT NULL
                       DEFAULT '',
    url        TEXT    NOT NULL
                       DEFAULT '#',
    linkerType TEXT    NOT NULL
                       DEFAULT 'normal',
    refId      INTEGER NOT NULL
                       DEFAULT 0,
    ifValid    INTEGER NOT NULL
                       DEFAULT 1,
    breif      TEXT    NOT NULL
                       DEFAULT '',
    breif2     TEXT    NOT NULL
                       DEFAULT ''
    
);

create table if not exists articles (
    id       INTEGER  PRIMARY KEY autoincrement,
    title    TEXT     DEFAULT '',
    img      TEXT     DEFAULT '',
    content  TEXT     DEFAULT '',
    logtime  DATETIME DEFAULT (datetime('now', 'localtime') ),
    linkerId INTEGER  NOT NULL,
    ifValid  INTEGER  DEFAULT 1,
    brief    TEXT     DEFAULT '',
    reporter TEXT     DEFAULT '',
    url      TEXT     DEFAULT ''
);