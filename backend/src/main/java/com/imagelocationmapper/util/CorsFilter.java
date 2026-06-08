package com.imagelocationmapper.util;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * CORS (Cross-Origin Resource Sharing) filter.
 *
 * The React app runs on http://localhost:5173 (Vite) while this backend runs on
 * http://localhost:8080 (Tomcat). Because the ports differ, the browser treats
 * them as different "origins" and blocks the request unless the server explicitly
 * allows it. This filter adds the headers that permit the React app to call us.
 *
 * @WebFilter("/*") applies it to every request reaching the backend.
 */
@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) res;

        // Allow the React dev server to call this API.
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Browsers send a "preflight" OPTIONS request first; answer it with 200.
        if ("OPTIONS".equalsIgnoreCase(((jakarta.servlet.http.HttpServletRequest) req).getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }
}
