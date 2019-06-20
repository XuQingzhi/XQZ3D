//XQZ3D.js
//Open Source 3D Engine
//Project link:https://github.com/xuqingzhi/xqz3d



/*
**兼容性部分
*/

//插入CSS规则
var HeadTag = document.getElementsByTagName("head")[0];
var StyleSheet = document.createElement("style");
StyleSheet.type="text/css";
StyleSheet.innerHTML = "html,body{height:100%;border:0;margin:0;padding:0;}#canvas{position:absolute;top:0;left:0;}"
HeadTag.appendChild(StyleSheet);

//插入Meta标签，指定utf-8字符和禁止缩放
MetaTag = document.createElement("meta");
MetaTag.name="viewport";
MetaTag.content="initial-scale=0.2, maximum-scale=0.2, minimum-scale=0.2, user-scalable=no";
MetaTag.charser="utf-8";
HeadTag.appendChild(MetaTag);



/*
**定义类和对象，构造生成器
*/

//3D顶点
function vector4(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = 1;
}

//2D顶点
function vector2(x, y) {
    this.x = x;
    this.y = y;
}

//角度
function angle3(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

//包含本地、世界、相机和屏幕位置的顶点
function vertex(LocalPosition){
    this.LocalPosition = LocalPosition;
    this.Position = new vector4(null, null, null);
    this.CamaraPosition = new vector4(null, null, null);
    this.ScreenPosition = new vector2(null, null);
}

//面
function mesh(vertex0Number, vertex1Number, vertex2Number){
    this.Vertexs = [vertex0Number, vertex1Number, vertex2Number];
}

//物体
function obj(Vertexs, Meshs, Position, Angle){
    this.Vertexs = Vertexs;
    this.Meshs = Meshs;
    this.Position = Position;
    this.Angle = Angle;
}

//相机
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

//1*3矩阵
function matrix13(a11, a12, a13){
    this.m11 = a11;
    this.m12 = a12;
    this.m13 = a13;
}

//3*3矩阵
function matrix33(a11, a12, a13, a21, a22, a23, a31, a32, a33){
    this.m11 = a11;
    this.m12 = a12;
    this.m13 = a13;
    this.m21 = a21;
    this.m22 = a22;
    this.m23 = a23;
    this.m31 = a31;
    this.m32 = a32;
    this.m33 = a33;
}



/*
**定义函数
*/

//用于计算相机视角的矩阵函数
function CamaraUpdating(camara){
    camara.XRotationMatrix = new matrix33(1, 0, 0, 0, Math.cos(camara.Angle.x), -Math.sin(camara.Angle.x), 0, Math.sin(camara.Angle.x), Math.cos(camara.Angle.x));
    camara.YRotationMatrix = new matrix33(Math.cos(camara.Angle.y), 0, Math.sin(camara.Angle.y), 0, 1, 0, -Math.sin(camara.Angle.y), 0, Math.cos(camara.Angle.y));
    camara.ZRotationMatrix = new matrix33(Math.cos(camara.Angle.z), -Math.sin(camara.Angle.z), 0, Math.sin(camara.Angle.z), Math.cos(camara.Angle.z), 0, 0, 0, 1)
    camara.ZYXRotationMatrix =  m33timesm33(m33timesm33(camara.ZRotationMatrix, camara.YRotationMatrix), camara.XRotationMatrix);
}

//将本地坐标转换为世界坐标
function LocalToWorld(obj) {
    for (var i = 0; i < obj.length; i++) {
        for (var v = 0; v < obj[i].Vertexs.length; v++) {
            obj[i].Vertexs[v].Position = new vector4(obj[i].Vertexs[v].LocalPosition.x + obj[i].Position.x, obj[i].Vertexs[v].LocalPosition.y + obj[i].Position.y, obj[i].Vertexs[v].LocalPosition.z + obj[i].Position.z);
        }
    }
}

//将世界坐标转换成相机坐标
function WorldToCamara(obj, camara) {
    for (var i = 0; i < obj.length; i++) {
        for (var v = 0; v < obj[i].Vertexs.length; v++) {
            var PositionMatrix = new matrix13(obj[i].Vertexs[v].Position.x - camara.Position.x, obj[i].Vertexs[v].Position.y - camara.Position.y, obj[i].Vertexs[v].Position.z - camara.Position.z);
            var CamaraPositionMatrix = m13timesm33(PositionMatrix, camara.XRotationMatrix);
            obj[i].Vertexs[v].CamaraPosition = new vector4(CamaraPositionMatrix.m11, CamaraPositionMatrix.m12, CamaraPositionMatrix.m13);
        }
    }
}

//将相机坐标转换成屏幕坐标，即透视投影
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

//绘制物体表面，即填色函数
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

//1*3矩阵乘3*3矩阵
function m13timesm33(m13, m33){
    var r11 = m13.m11 * m33.m11 + m13.m12 * m33.m21 + m13.m13 * m33.m31;
    var r12 = m13.m11 * m33.m12 + m13.m12 * m33.m22 + m13.m13 * m33.m32;
    var r13 = m13.m11 * m33.m13 + m13.m12 * m33.m23 + m13.m13 * m33.m33;
    return new matrix13(r11, r12, r13);
}

//3*3矩阵乘3*3矩阵
function m33timesm33(a33, b33){
    var r11 = a33.m11 * b33.m11 + a33.m12 * b33.m21 + a33.m13 * b33.m31;
    var r12 = a33.m11 * b33.m12 + a33.m12 * b33.m22 + a33.m13 * b33.m32;
    var r13 = a33.m11 * b33.m13 + a33.m12 * b33.m23 + a33.m13 * b33.m33;

    var r21 = a33.m21 * b33.m11 + a33.m22 * b33.m21 + a33.m33 * b33.m31;
    var r22 = a33.m21 * b33.m12 + a33.m22 * b33.m22 + a33.m33 * b33.m32;
    var r23 = a33.m21 * b33.m13 + a33.m22 * b33.m23 + a33.m33 * b33.m33;

    var r31 = a33.m31 * b33.m11 + a33.m32 * b33.m21 + a33.m33 * b33.m31;
    var r32 = a33.m31 * b33.m12 + a33.m32 * b33.m22 + a33.m33 * b33.m32;
    var r33 = a33.m31 * b33.m13 + a33.m32 * b33.m23 + a33.m33 * b33.m33;
    return new matrix33(r11, r12, r13, r21, r22, r23, r31, r32, r33);
}