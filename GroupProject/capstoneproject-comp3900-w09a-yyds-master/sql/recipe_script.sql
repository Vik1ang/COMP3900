create table comment
(
    comment_id      int auto_increment
        primary key,
    recipe_id       int           not null,
    comment         text          not null,
    `like`          int default 0 not null,
    comment_user_id varchar(255)  not null,
    create_time     varchar(255)  not null,
    update_time     varchar(255)  not null
);

create table picture
(
    picture_id int auto_increment
        primary key,
    recipe_id  int          null,
    file_path  varchar(255) not null
);

create table user
(
    user_id       varchar(255) not null,
    email         varchar(255) not null,
    first_name    varchar(255) not null,
    last_name     varchar(255) not null,
    nick_name     varchar(255) not null,
    birthdate     varchar(255) not null,
    gender        int          not null,
    contact       varchar(255) null,
    address       varchar(255) null,
    create_time   varchar(255) not null,
    profile_photo varchar(255) null,
    constraint user_email_uindex
        unique (email),
    constraint user_user_id_uindex
        unique (user_id)
);

alter table user
    add primary key (user_id);

create table user_account
(
    user_id  varchar(255) not null,
    password varchar(255) not null,
    salt     varchar(255) not null,
    status   int          null,
    constraint user_account_userId_uindex
        unique (user_id)
);

alter table account
    add primary key (user_id);

create table user_admin
(
    admin_id   int auto_increment
        primary key,
    user_id    varchar(255) not null,
    first_name varchar(255) not null,
    last_name  varchar(255) not null,
    constraint admin_user_id_uindex
        unique (user_id),
    constraint admin_user_id_uindex_2
        unique (user_id)
);

create table user_recipe
(
    recipe_id   int auto_increment
        primary key,
    user_id     varchar(255) not null,
    recipe_name varchar(255) not null,
    ingredients text         null,
    method      text         null,
    meal_type   varchar(255) null,
    photo_id    varchar(255) not null,
    comment_id  varchar(255) not null,
    create_time varchar(255) not null,
    cook_time   int          null,
    constraint user_recipe_comment_id_uindex
        unique (comment_id),
    constraint user_recipe_photo_id_uindex
        unique (photo_id)
);


