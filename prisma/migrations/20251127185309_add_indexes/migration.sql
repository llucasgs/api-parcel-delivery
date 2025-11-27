-- CreateIndex
CREATE INDEX "deliveries_user_id_idx" ON "deliveries"("user_id");

-- CreateIndex
CREATE INDEX "deliveries_status_idx" ON "deliveries"("status");

-- CreateIndex
CREATE INDEX "deliveries_user_id_status_idx" ON "deliveries"("user_id", "status");

-- CreateIndex
CREATE INDEX "delivery_logs_delivery_id_idx" ON "delivery_logs"("delivery_id");
