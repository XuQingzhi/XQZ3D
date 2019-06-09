
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

function camara(Position, Angle, Screen, Plan, D, Scaling) {
    this.Screen = Screen;
    this.Plan = Plan;
    this.Position = Position;
    this.Angle = Angle;
    this.D = D;
    this.Scaling = Scaling * D;
    this.XRotationMatrix = new matrix33(null, null, null, null, null, null, null, null, null);
    this.YRotationMatrix = new matrix33(null, null, null, null, null, null, null, null, null);
    this.ZRotationMatrix = new matrix33(null, null, null, null, null, null, null, null, null);
    
    this.ZYXRotationMatrix = new matrix33(null, null, null, null, null, null, null, null, null);
}