import Router, { Response } from "express";
import { Request } from "@core/express";
import requireSession from "../middlewares/requireSession";

const menuRouter = Router();

// Keep consistent with other routes: require session
menuRouter.use(requireSession);

/**
 * GET /v1/menu/rss
 * Proxies the external catering RSS feed (Servica) server-to-server.
 * This avoids browser CORS limitations.
 */
menuRouter.get("/rss", async (_req: Request, res: Response) => {
  try {
    const url =
      "https://menu.servica.fi/ServicaAromieMenus/FI/Default/_/KuopioPAIVAKODIT/Rss.aspx?Id=59ff93fb-bc2a-4599-9331-7228e7e7bcdb&DateMode=0";

    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "uef-swe1-final/1.0",
        Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
      },
    });

    if (!upstream.ok) {
      res.status(502).json({
        error: "Upstream RSS fetch failed",
        status: 502,
      });
      return;
    }

    const xml = await upstream.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (e) {
    console.error("Menu RSS proxy error:", e);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export default menuRouter;
