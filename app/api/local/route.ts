import { NextResponse } from "next/server";

const BASE_URL = "http://localhos:11434";


import type { NextApiRequest, NextApiResponse } from 'next'

//import { useContextActions } from '../../../context/GeneralContext'

export default async function assetHandler(req: NextApiRequest, res: NextApiResponse<any | null>) {
  const { method } = req
  
  switch (method) {
     case 'GET':
        try {
        const tempurl =BASE_URL + "/api/tags"
            const res = await fetch(tempurl,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
            );
            const goalmap = await res.json();
            const response = goalmap.data.goal
        
            return NextResponse.json({ response });
        } catch (e) {
          console.error('Request error', e)
          res.status(500).end();
        }
        break  
 

    default:
      res.setHeader('Allow', ['GET', 'PUT','POST', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}