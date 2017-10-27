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
    brief      TEXT    NOT NULL
                       DEFAULT '',
    brief2     TEXT    NOT NULL
                       DEFAULT ''
    
);
-- 文章表
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

-- 文章点赞表
drop table article_praises;
create table if not exists article_praises (
    id        INTEGER  PRIMARY KEY,
    userId    INTEGER  DEFAULT 0,
    articleId INTEGER  NOT NULL,
    logtime   DATETIME DEFAULT (datetime('now', 'localtime') ) 
);

-- 评论表
drop table comments;
create table if not exists comments (
    id        INTEGER  PRIMARY KEY,
    content   TEXT,
    replyTo   INTEGER,
    articleId INTEGER,
    userId    INTEGER,
    ifValid   INTEGER  DEFAULT 1,
    logtime   DATETIME DEFAULT (datetime('now', 'localtime') ) 
);

-- 评论点赞表
drop table comment_praises;
create table if not exists comment_praises (
    id        INTEGER  PRIMARY KEY,
    userId    INTEGER  DEFAULT 0,
    commentId INTEGER  NOT NULL,
    logtime   DATETIME DEFAULT (datetime('now', 'localtime') ) 
);

-- 用户表
drop table User;
create table if not exists User (
    id      INTEGER  NOT NULL
                     PRIMARY KEY AUTOINCREMENT,
    name    TEXT     NOT NULL
                     DEFAULT '',
    pswd    TEXT     NOT NULL
                     DEFAULT '12345',
    phone   TEXT     NOT NULL
                     DEFAULT '',
    img     TEXT     NOT NULL
                     DEFAULT ('http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg'),
    sex     TEXT     NOT NULL
                     DEFAULT ('女'),
    ifValid INTEGER  NOT NULL
                     DEFAULT 1,
    logtime DATETIME NOT NULL
                     DEFAULT (datetime('now', 'localtime') ) 
);