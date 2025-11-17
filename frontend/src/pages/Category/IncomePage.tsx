// src/pages/Category/IncomePage.tsx
import TransactionFormWithCategory from "../../components/TransactionFormWithCategory";
import TransactionOverview from "../../components/TransactionOverview";

export default function IncomePage() {
  return (
    <div className="p-6 space-y-8">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-green-600 drop-shadow-md">
        Tiền Thu
      </h1>

      {/* Form nhập giao dịch */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 transition-transform hover:scale-[1.01]">
        <TransactionFormWithCategory type="income" />
      </div>

      {/* Tổng quan giao dịch */}
      <div className="p-6 bg-white border border-green-100 shadow-lg rounded-2xl">
        <TransactionOverview type="income" />
      </div>
    </div>
  );
}
