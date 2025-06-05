import Layout from "./Layout";

export function PageWrapper({ pageName, loading, error, htmlContent }) {
  return (
    <Layout pageName={pageName} loading={loading} error={error} htmlContent={htmlContent} >
    </Layout>
  );
}
