package bitc.fullstack.meausrepro_spring.geometry;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.WKTReader;

public class GeometryUtil {
    public static Geometry wktToGeometry(final String wkt) throws Exception{
        WKTReader reader = new WKTReader();
        return reader.read(wkt);
    }
}
