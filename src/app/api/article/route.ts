/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiPost } from '../database';
import { apiGet } from '../database';
import { withAuth } from '../middlewares/withAuth';

// Get
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request, res: Response) {
  const query = `
  SELECT * from articles
`;

  let status, body;
  try {
    await apiGet(query)
      .then((res) => {
        status = 200;
        body = res;
      })
      .catch((err: Error) => {
        status = 400;
        body = { error: err };
      });
    return Response.json(body, {
      status,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
    return Response.json(
      { error: error },
      {
        status: 400,
      },
    );
  }
}

// Post

export async function POST(req: Request, res: Response) {
  return withAuth(req, async (request: Request) => {
    const body = await req.json();
    const { name, description, imageUrl, articleUrl, slug } = body;

    const query = `
      INSERT INTO articles(name, description, imageUrl, articleUrl, slug)
      VALUES(?, ?, ?, ?, ?)
    `;
    const values = [name, description, imageUrl, articleUrl, slug];

    let status, respBody;
    await apiPost(query, values)
      .then(() => {
        status = 200;
        respBody = { message: 'Successfully created article' };
      })
      .catch((err) => {
        status = 400;
        respBody = err;
      });
    return Response.json(respBody, {
      status,
    });
  });
}
