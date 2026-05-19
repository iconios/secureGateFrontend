

import VerificationForm from "../../../../components/layout/home/verification";

type verificationPageProps = {
    searchParams: Promise<{
        email?: string | string[];
    }>;
};

const VerificationPage = async ({ searchParams }: verificationPageProps) => {
    const emailParam = (await searchParams).email;

    const email = Array.isArray(emailParam) ? emailParam[0] ?? "": emailParam ?? "";
    
    console.log("VerificationPage rendered with email:", email);
  return <VerificationForm email={email} />;
};

export default VerificationPage;