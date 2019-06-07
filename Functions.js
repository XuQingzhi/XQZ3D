// JavaScript source code
function vector4(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = 1;
}

function vector2(x, y) {
    this.x = x;
    this.y = y;
}

function angle3(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

function vertex(LocalPosition){
    this.LocalPosition = LocalPosition;
    this.Position = new vector4(null, null, null);
    this.CamaraPosition = new vector4(null, null, null);
    this.ScreenPosition = new vector2(null, null);
}

function mesh(vertex0Number, vertex1Number, vertex2Number){
    this.Vertexs = [vertex0Number, vertex1Number, vertex2Number];
}

function obj(Vertexs, Meshs, Position, Angle){
    this.Vertexs = Vertexs;
    this.Meshs = Meshs;
    this.Position = Position;
    this.Angle = Angle;
}

function camara(Position, Angle, Screen, Plan, D) {
    this.Screen = Screen;
    this.Plan = Plan;
    this.Position = Position;
    this.Angle = Angle;
    this.D = D;
}

function LocalToWorld(obj) {
    for (var i = 0; i < obj.length; i++) {
        for (var v = 0; v < obj[i].Vertexs.length; v++) {
            obj[i].Vertexs[v].Position = new vector4(obj[i].Vertexs[v].LocalPosition.x + obj[i].Position.x, obj[i].Vertexs[v].LocalPosition.y + obj[i].Position.y, obj[i].Vertexs[v].LocalPosition.z + obj[i].Position.z);
        }
    }
}

function WorldToCamara(obj, camara) {
    for (var i = 0; i < obj.length; i++) {
        for (var v = 0; v < obj[i].Vertexs.length; v++) {
            obj[i].Vertexs[v].CamaraPosition = new vector4(obj[i].Vertexs[v].Position.x - camara.Position.x, obj[i].Vertexs[v].Position.y - camara.Position.y, obj[i].Vertexs[v].Position.z - camara.Position.z);
        }
    }
}

function PerspectiveProjection(obj, camara) {
    for (var i = 0; i < obj.length; i++) {
        for (var v = 0; v < obj[i].Vertexs.length; v++) {
            obj[i].Vertexs[v].ScreenPosition.x = (camara.Screen.x / camara.Plan.x) * camara.D * obj[i].Vertexs[v].CamaraPosition.x / obj[i].Vertexs[v].CamaraPosition.z + (0.5 * (camara.Screen.x));
            obj[i].Vertexs[v].ScreenPosition.y = -(camara.Screen.y / camara.Plan.y) *camara.D * obj[i].Vertexs[v].CamaraPosition.y / obj[i].Vertexs[v].CamaraPosition.z + (0.5 * (camara.Screen.y));
        }
    }
}