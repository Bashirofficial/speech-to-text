-- CreateTable
CREATE TABLE "transcriptions" (
    "id" UUID NOT NULL,
    "audio_file_path" TEXT NOT NULL,
    "transcribed_text" TEXT NOT NULL DEFAULT 'Transcription in progress...',
    "original_file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "transcriptions_pkey" PRIMARY KEY ("id")
);
