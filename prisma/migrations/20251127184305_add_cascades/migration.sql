-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_user_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_logs" DROP CONSTRAINT "delivery_logs_delivery_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_logs" DROP CONSTRAINT "delivery_logs_performed_by_fkey";

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_logs" ADD CONSTRAINT "delivery_logs_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_logs" ADD CONSTRAINT "delivery_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
