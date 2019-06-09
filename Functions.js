// JavaScript source code
function CamaraUpdating(camara){
    camara.XRotationMatrix = new matrix33(1, 0, 0, 0, Math.cos(camara.Angle.x), -Math.sin(camara.Angle.x), 0, Math.sin(camara.Angle.x), Math.cos(camara.Angle.x));
    camara.YRotationMatrix = new matrix33(Math.cos(camara.Angle.y), 0, Math.sin(camara.Angle.y), 0, 1, 0, -Math.sin(camara.Angle.y), 0, Math.cos(camara.Angle.y));
    camara.ZRotationMatrix = new matrix33(Math.cos(camara.Angle.z), -Math.sin(camara.Angle.z), 0, Math.sin(camara.Angle.z), Math.cos(camara.Angle.z), 0, 0, 0, 1)
    camara.ZYXRotationMatrix =  m33timesm33(m33timesm33(camara.ZRotationMatrix, camara.YRotationMatrix), camara.XRotationMatrix);
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
            var PositionMatrix = new matrix13(obj[i].Vertexs[v].Position.x - camara.Position.x, obj[i].Vertexs[v].Position.y - camara.Position.y, obj[i].Vertexs[v].Position.z - camara.Position.z);
            var CamaraPositionMatrix = m13timesm33(PositionMatrix, camara.XRotationMatrix);
            obj[i].Vertexs[v].CamaraPosition = new vector4(CamaraPositionMatrix.m11, CamaraPositionMatrix.m12, CamaraPositionMatrix.m13);
        }
    }
}

function PerspectiveProjection(obj, camara) {
    for (var i = 0; i < obj.length; i++) {
        for (var v = 0; v < obj[i].Vertexs.length; v++) {
            if(obj[i].Vertexs[v].CamaraPosition.z > camara.D){
                obj[i].Vertexs[v].ScreenPosition.x = camara.Scaling * (obj[i].Vertexs[v].CamaraPosition.x / obj[i].Vertexs[v].CamaraPosition.z) + (0.5 * (camara.Screen.x));
                obj[i].Vertexs[v].ScreenPosition.y = -camara.Scaling * (obj[i].Vertexs[v].CamaraPosition.y / obj[i].Vertexs[v].CamaraPosition.z) + (0.5 * (camara.Screen.y));
            }else{
                obj[i].Vertexs[v].ScreenPosition.x = null;
                obj[i].Vertexs[v].ScreenPosition.y = null;  
            }
        }
    }
}

function PrintObjectMesh(obj, ctx, ctxWidth, ctxHeight){
    for (var i = 0; i < obj.length; i++) {
        for (var m = 0; m < obj[i].Meshs.length; m++) {
            var printWeight = 0;
            if (obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.x > 0 || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[1]].ScreenPosition.x > 0 || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[2]].ScreenPosition.x > 0){
                printWeight += 1;
            }else{
                printWeight -= 1;
            }
            if (obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.x < ctxWidth || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[1]].ScreenPosition.x < ctxWidth || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[2]].ScreenPosition.x < ctxWidth){
                printWeight += 1;
            }else{
                printWeight -= 1;
            }

            if (obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.y > 0 || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[1]].ScreenPosition.y > 0 || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[2]].ScreenPosition.y > 0){
                printWeight += 1;
            }else{
                printWeight -= 1;
            }
            if (obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.y < ctxHeight || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[1]].ScreenPosition.y < ctxHeight || obj[i].Vertexs[obj[i].Meshs[m].Vertexs[2]].ScreenPosition.y < ctxHeight){
                printWeight += 1;
            }else{
                printWeight -= 1;
            }
            if(printWeight => 4){
                ctx.beginPath();
                ctx.moveTo(obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.x, obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.y);
                ctx.lineTo(obj[i].Vertexs[obj[i].Meshs[m].Vertexs[1]].ScreenPosition.x, obj[i].Vertexs[obj[i].Meshs[m].Vertexs[1]].ScreenPosition.y);
                ctx.lineTo(obj[i].Vertexs[obj[i].Meshs[m].Vertexs[2]].ScreenPosition.x, obj[i].Vertexs[obj[i].Meshs[m].Vertexs[2]].ScreenPosition.y);
                ctx.lineTo(obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.x, obj[i].Vertexs[obj[i].Meshs[m].Vertexs[0]].ScreenPosition.y);
                ctx.fill();
            }else{

            }
        }
    }
}