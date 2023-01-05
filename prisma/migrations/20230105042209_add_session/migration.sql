-- CreateTable
CREATE TABLE "Session" (
    "id" BIGINT NOT NULL,
    "shift" BIGINT,
    "user" BIGINT NOT NULL,
    "original_start_time" TIMESTAMP(3) NOT NULL,
    "original_end_time" TIMESTAMP(3),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" BIGINT NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);
