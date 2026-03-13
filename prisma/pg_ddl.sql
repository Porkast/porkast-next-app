CREATE TABLE feed_channel (
    id varchar(64) NOT NULL, title varchar(128), channel_desc text, image_url varchar(128), link varchar(128), feed_link varchar(128), copyright varchar(128), language varchar(128), author varchar(128), owner_name varchar(128), owner_email varchar(128), feed_type varchar(128), categories varchar(128), source varchar(64), feed_id varchar(64), PRIMARY KEY (id)
);

CREATE TABLE feed_item (
    id varchar(64) NOT NULL, channel_id varchar(64) NOT NULL, guid varchar(256), title text, link text, pub_date date, author varchar(128), input_date timestamp, image_url varchar(256), enclosure_url text, enclosure_type varchar(256), enclosure_length varchar(256), duration varchar(256), episode varchar(64), explicit varchar(64), season varchar(64), episodeType varchar(64), description bytea, channel_title text, feed_id varchar(64) NOT NULL, feed_link varchar(255), source varchar(255), PRIMARY KEY (id)
);
CREATE INDEX rfi_idx_channel_id ON feed_item (channel_id);
CREATE INDEX rfi_idx_pub_date ON feed_item (pub_date);

CREATE TABLE keyword_subscription (
    id SERIAL PRIMARY KEY, keyword varchar(128) NOT NULL, feed_channel_id varchar(128) NOT NULL, feed_item_id varchar(128) NOT NULL, create_time timestamp DEFAULT NULL, country varchar(64) DEFAULT NULL, source varchar(64) DEFAULT NULL, exclude_feed_id varchar(64) DEFAULT NULL
);

CREATE UNIQUE INDEX ks_idx_kcse ON keyword_subscription (
    keyword, country, source, exclude_feed_id
);

CREATE TABLE user_info (
    id varchar(64) PRIMARY KEY, username varchar(128) DEFAULT NULL, nickname varchar(128) DEFAULT NULL, password varchar(128) DEFAULT NULL, email varchar(128) DEFAULT NULL, phone varchar(128) DEFAULT NULL, reg_date date DEFAULT NULL, update_date date DEFAULT NULL, avatar varchar(256) DEFAULT NULL
);

CREATE TABLE user_listen_later (
    id varchar(64) PRIMARY KEY, user_id varchar(128), item_id varchar(128), channel_id varchar(128), reg_date timestamp DEFAULT NULL, status int DEFAULT 1
);

CREATE INDEX ull_idx_user_id ON user_listen_later (user_id);

CREATE INDEX ull_idx_item_id ON user_listen_later (item_id);

CREATE TABLE user_playlist (
    id varchar(64) PRIMARY KEY, playlist_name varchar(128), description bytea, user_id varchar(128), reg_date timestamp DEFAULT NULL, status int DEFAULT 1, creator_id varchar(128), orig_playlist_id varchar(64)
);

CREATE UNIQUE INDEX up_idx_uid_name ON user_playlist (user_id, playlist_name);

CREATE INDEX up_idx_user_id ON user_playlist (user_id);

CREATE TABLE user_playlist_item (
    id VARCHAR(64) PRIMARY KEY, playlist_id VARCHAR(128) NOT NULL, item_id VARCHAR(128) NOT NULL, channel_id VARCHAR(128), reg_date TIMESTAMP, status INTEGER DEFAULT 1, CONSTRAINT upi_idx_playlist_id UNIQUE (playlist_id)
);

CREATE TABLE user_subscription (
    id VARCHAR(64), user_id VARCHAR(128), create_time TIMESTAMP, status INTEGER DEFAULT 1, keyword VARCHAR(128), order_by_date INTEGER, lang VARCHAR(64), country VARCHAR(64), exclude_feed_id VARCHAR(64), source VARCHAR(64), ref_id VARCHAR(64), ref_name VARCHAR(255), type VARCHAR(128) DEFAULT 'searchKeyword', CONSTRAINT usk_idx_keyword UNIQUE (keyword), CONSTRAINT usk_idx_user_id UNIQUE (user_id), CONSTRAINT usk_user_id_keyword UNIQUE (user_id, keyword, source)
);

CREATE TABLE IF NOT EXISTS public.verification_token (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    token VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP(6) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS verification_token_email_token_key ON public.verification_token(email, token);