import { StatusSwitch } from "../../../components/layout/payment/statusSwitch";

type SearchParams = Promise<{ [key: string]: string }>;

const PaymentStatusPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { status, reason, reference } = await searchParams;

  return <StatusSwitch status={status} reason={reason} reference={reference} />;
};

export default PaymentStatusPage;
