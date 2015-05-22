/*
 * (C) Copyright 2015 Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     Thibaud Arguillere
 */

package org.illinoismutual;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.ModuleRoot;


/**
 * The root entry for the WebEngine module. 
 * 
 */
@Path("/IllinoisMutual")
@Produces("text/html;charset=UTF-8")
@WebObject(type="IllinoisMutualRoot")
public class IllinoisMutualRoot extends ModuleRoot {
    
    private static final Log log = LogFactory.getLog(IllinoisMutualRoot.class);

    @GET
    public Object doGet() {
        return getView("index");
    }
    
    @Path("{what}")
    @GET
    public Object doSubPath(@PathParam("what") String inWhat,
            @QueryParam("p1") String inParam1) {
        
        Object result = null;
        DocumentModel currentDoc;
        CoreSession session = ctx.getCoreSession();
        //String currentUser = session.getPrincipal().getName();
        
        log.warn(inWhat + " - " + inParam1);
                
        switch(inWhat) {
        case "oneEmployer":
            // using the queryparam. inParam1 is the name of the company
            DocumentModelList docs = session.query("SELECT * FROM Employer WHERE dc:title ILIKE '" + inParam1 + "'");
            ctx.setProperty("employerId", "");
            ctx.setProperty("employerName", "");
            if(docs.size() > 0) {
                currentDoc = docs.get(0);
                ctx.setProperty("employerId", currentDoc.getId());
                ctx.setProperty("employerName", currentDoc.getTitle());
            }
            result = getView("oneEmployer");
            break;
            
        case "employers":
            result = getView("employers");
            break;
            
        case "newEnrollment":
         // using the queryparam inParam1 is the ID of an existing employee
            ctx.setProperty("employeeId", inParam1);
            // Get the employer
            DocumentModel employee = session.getDocument(new IdRef(inParam1)); 
            ctx.setProperty("employerId", employee.getPropertyValue("employee:employer"));
            result = getView("newEnrollment");
            break;
        
        default:
            // Should have a 404
            result = getView("index");
        }
        
        return result;
        
    }

}
