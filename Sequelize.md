Sequelize.STRING // VARCHAR(255)
Sequelize.STRING(1234) // VARCHAR(1234)
Sequelize.STRING.BINARY // VARCHAR BINARY
Sequelize.TEXT // TEXT
Sequelize.TEXT('tiny') // TINYTEXTSequelize.INTEGER // INTEGER
Sequelize.BIGINT // BIGINT
Sequelize.BIGINT(11) // BIGINT(11)Sequelize.FLOAT // FLOAT
Sequelize.FLOAT(11) // FLOAT(11)
Sequelize.FLOAT(11, 12) // FLOAT(11,12)Sequelize.REAL // REAL 仅限于 PostgreSQL.
Sequelize.REAL(11) // REAL(11) 仅限于 PostgreSQL.
Sequelize.REAL(11, 12) // REAL(11,12) 仅限于 PostgreSQL.Sequelize.DOUBLE // DOUBLE
Sequelize.DOUBLE(11) // DOUBLE(11)
Sequelize.DOUBLE(11, 12) // DOUBLE(11,12)Sequelize.DECIMAL // DECIMAL
Sequelize.DECIMAL(10, 2) // DECIMAL(10,2)Sequelize.DATE // DATETIME 针对 mysql / sqlite, TIMESTAMP WITH TIME ZONE 针对 postgres
Sequelize.DATE(6) // DATETIME(6) 针对 mysql 5.6.4+. 小数秒支持多达 6 位精度
Sequelize.DATEONLY // DATE 不带时间.
Sequelize.BOOLEAN // TINYINT(1)Sequelize.ENUM('value 1', 'value 2') // 一个允许具有 “value 1” 和 “value 2” 的 ENUM
Sequelize.ARRAY(Sequelize.TEXT) // 定义一个数组。 仅限于 PostgreSQL。
Sequelize.ARRAY(Sequelize.ENUM) // 定义一个 ENUM 数组. 仅限于 PostgreSQL。Sequelize.JSON // JSON 列. 仅限于 PostgreSQL, SQLite and MySQL.
Sequelize.UUID // PostgreSQL 和 SQLite 的 UUID 数据类型, CHAR(36) BINARY 针对于 MySQL (使用默认值: Sequelize.UUIDV1 或 Sequelize.UUIDV4 来让 sequelize 自动生成 ID)Sequelize.GEOMETRY // 空间列. 仅限于 PostgreSQL (具有 PostGIS) 或 MySQL.
Sequelize.GEOMETRY('POINT') // 具有几何类型的空间列. 仅限于 PostgreSQL (具有 PostGIS) 或 MySQL.
Sequelize.GEOMETRY('POINT', 4326) // 具有几何类型和 SRID 的空间列. 仅限于 PostgreSQL (具有 PostGIS) 或 MySQL.
