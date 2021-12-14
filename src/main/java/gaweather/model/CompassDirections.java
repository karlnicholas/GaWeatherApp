package gaweather.model;

public enum CompassDirections {
    N, NNNE, NNE, NE, ENE, EENE,
    E, EESE, ESE, SE, SSE, SSSE,
    S, SSSW, SSW, SW, WSW, WWSW,
    W, WWNW, WNW, NW, NNW, NNNW;

    public static int convertToDegrees(CompassDirections d) {
        return d.ordinal() * 15;
    }
}
