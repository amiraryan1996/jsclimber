import { prisma } from '@/lib/prisma';

const OverviewPage = async () => {
  const pages = await prisma.page.findMany();
  console.log(pages);
  return (
    <div>
      OverviewPage a simple grid layout
      {pages.map((item, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
      ))}
    </div>
  );
};

export default OverviewPage;
