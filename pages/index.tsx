import Layout from "@/components/Layout";
import ProfileTable from "@/components/ProfileTable";
import ResultChartStack from "@/components/ResultChartStack";
import SessionGuard from "@/components/SessionGuard";
import { prisma } from "@/lib/prisma";
import { TestResultWithAverage, TestResultWithTypedTest } from "@/types/test";
import { Alert, Stack, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export type HomeProps = {
  results: TestResultWithAverage[];
};

const HomePage: NextPage<HomeProps> = ({ results }) => {
  return (
    <SessionGuard allowedRoles={["STUDENT"]}>
      {({ user }) => (
        <Layout>
          <Stack spacing={32}>
            <Title>Deneme Grafik</Title>

            <Alert variant="filled" icon={<IconInfoCircle />}>
              Merhaba {user.name}, bu websitesindeki veriler sadece senin için
              saklanmaktadır.
            </Alert>

            <ProfileTable />

            <Text>
              Aşağıdaki grafik değerlerini inceleyerek deneme sonuçlarının zaman
              içinde nasıl değiştiğini görebilirsin ve kendi sonuçlarını
              ortalama ile karşılaştırabilirsin.
            </Text>

            <ResultChartStack results={results} studentName={user.name} />
          </Stack>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  if (session.user.role !== "STUDENT") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const results: TestResultWithTypedTest[] = await prisma.testResult.findMany({
    where: { studentId: session.user.id },
    include: { test: { include: { type: true } } },
  });

  const averages = await prisma.$transaction(
    results.map((result) =>
      prisma.testResult.aggregate({
        where: { test: { id: result.test.id } },
        _avg: { score: true },
      })
    )
  );

  const resultsWithAverages: TestResultWithAverage[] = results.map(
    (result, index) => ({
      ...result,
      average: averages[index]._avg.score ?? 0,
    })
  );

  return {
    props: {
      results: JSON.parse(JSON.stringify(resultsWithAverages)),
    },
  };
};
