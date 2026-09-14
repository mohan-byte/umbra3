-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistDomain" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanResult" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "watchlistId" TEXT,
    "riskScore" INTEGER NOT NULL,
    "riskBand" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistDomain_userId_domain_key" ON "WatchlistDomain"("userId", "domain");

-- CreateIndex
CREATE INDEX "ScanResult_domain_scannedAt_idx" ON "ScanResult"("domain", "scannedAt");

-- CreateIndex
CREATE INDEX "ScanResult_watchlistId_idx" ON "ScanResult"("watchlistId");

-- AddForeignKey
ALTER TABLE "WatchlistDomain" ADD CONSTRAINT "WatchlistDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanResult" ADD CONSTRAINT "ScanResult_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "WatchlistDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
