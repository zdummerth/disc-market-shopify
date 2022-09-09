import { storefrontClient } from "../../lib/callShopify";
import Page from "../../components/Page";
import transformContent from "../../lib/transform-content";

export default function CollectionPage({ collection, products, sections }) {
  console.log({ sections });
  return (
    <div>
      <Page sections={sections} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  // console.log(params.id)
  const sections = [
    {
      name: "collection_full",
      collection: params.handle,
      config: {
        enlarge_first: false,
        action: "basic_grid",
      },
    },
  ];

  const content = await transformContent(sections);

  return {
    props: {
      sections: content,
    },
  };
}

export async function getStaticPaths() {
  const response = await storefrontClient.query({
    data: {
      query: `{
        collections(first: 250) {
          edges {
            node {
              handle
            }
          }
        }
      }`,
    },
  });

  const paths = response.body.data.collections.edges.map(({ node }) => ({
    params: { handle: node.handle },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}
