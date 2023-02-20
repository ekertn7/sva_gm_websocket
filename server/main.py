'''
query_types:
status  type        from   -> to     description
------- ----------- ---------------- --------------------------------
+       file        client -> server {"query_type": "file",
                                      "message": b"file_data",
                                      "filename": "file_name",
                                      "separator": "separator"}
+       columns     server -> client {"query_type": "columns",
                                      "message": [df_columns]}
-       replace     client -> server {"query_type": "replace",
                                      "message": {df_columns : client_columns, ...}}
+js     graph       server -> client {"query_type": "graph",
                                      "message": {graph_coords}
+js     algorithms  client -> server {"query_type": "metrics",
                                      "message": "algorithmShortestPath,algorithmSearchStronglyConnectedComponentsKosaraju,algorithmSearchStronglyConnectedComponentsTarjan,algorithmGetSimpleLoops,algorithmAdjMatrix,algorithmKruskal,algorithmPrim,algorithmMaximalMatching"}
+js     metrics     client -> server {"query_type": "metrics",
                                      "message": "metricPageRank,metricDegreeСentrality"}
?       result      server -> client {"query_type": "result",
                                      "message": true | false}
+js     exit        client -> server {"query_type": "exit"}
'''
PORT = 1422

import asyncio
import nest_asyncio
import websockets
import json
import base64
import os
import pandas as pd
import webbrowser


nest_asyncio.apply()


def query_file(message: str, file_name: str, separator: str = ';') -> str:
    message_decoded = base64.b64decode(message)
    os.makedirs("data", exist_ok=True)
    file = open(os.path.join("data", file_name), "wb")
    file.write(message_decoded)
    file.close()

    if file_name.split('.')[-1] == "xlsx" or file_name.split('.')[-1] == "xls":
        df = pd.read_excel(os.path.join("data", file_name), dtype="str")
        # rename_dict = dict((elem, str(elem)) for elem in df.columns.tolist())
        # df.rename(columns = rename_dict, inplace = True)
        # request = json.dumps({"query_type":"columns", "message":[str(elem) for elem in df.columns]}, ensure_ascii=False)
    elif file_name.split('.')[-1] == "csv" or file_name.split('.')[-1] == "txt":
        df = pd.read_csv(os.path.join("data", file_name), dtype="str", encoding="utf-8", sep=separator)
        # request = json.dumps({"query_type":"columns", "message":[str(elem) for elem in df.columns]}, ensure_ascii=False)
    else:
        df = pd.DataFrame()
        # request = []
    
    request = json.dumps({"query_type":"graph", "message":generate_json()}, ensure_ascii=False)
    return request, df


# def query_columns(message: str, df: pd.DataFrame) -> str:
#     df = df[message]
#     # вызов функции генерации графа
#     # вызов функции генерации json
#     result = []
#     return str(result)


def generate_json() -> str:
    example = {
        "layout": {
            "name": "Random",
            "fontFamilies": "Inter",
            "fontSize": 14,
            "positionLabelNode": "BottomCenter",
            "positionLabelEdge": "TopCenterLable",
            "colorLabelNode": "#000000",
            "colorLabelEdge": "#000000"
    
        },
        "nodes": [
            {
                "id": "id0",
                "position": {"x": 500, "y": 300},
                "shape": "Circle",
                "color": "#00FF00",
                "size": 100,
                "label": "Нода 1",
                "group": "Node1",
                "infoLegend": {"name": "Anna","bday": "01.04.1983"}
            },
            {
                "id": "id1",
                "position": {"x": 800, "y": 200},
                "shape": "Circle",
                "color": "#FF0000",
                "size": 50,
                "label": "Нода 2",
                "group": "Node2",
                "infoLegend": {"name": "Petr","bday": "07.09.1989"}
            }
        ],
        "edges": [
            {
                "id": "idEdge0",
                "from": "id0",
                "to": "id1",
                "width": 4,
                "shape": "curve",
                "arrow": "angle",
                "color": "#0000FF",
                "label": "Вес эджа",
                "group": "Edge1"
            }
        ]
    }
    return example


def run_algorithms(algorithms: str) -> None:
    for algorithm in algorithms.split(','):
        print(f"[.] Run algorithm:       {algorithm}")


def run_metrics(metrics: str) -> None:
    for metric in metrics.split(','):
        print(f"[.] Run metric:          {metric}")


def exit() -> None:
    print(f"[.] Exit?:               da")


queries_with_functions = {
    "file": query_file,
    "algorithms": run_algorithms,
    "metrics": run_metrics,
    "exit": exit
}

class Server:
    clients = [] # список клиентов

    async def send_message(self, message: str):
        for client in self.clients:
            await client.send(message)


    async def new_client_connected(self, client_socket: websockets.WebSocketClientProtocol, path: str):
        print(f"[+] Client connected:    {client_socket}")
        self.clients.append(client_socket) # добавление клиента в список клиентов
        while True:
            try:
                message = await client_socket.recv() # recieve = получение сообщений
                print(f"[o] Client recv message: {message[:70]}")
            except websockets.ConnectionClosed:
                print(f"[x] Client disconnected: {client_socket}")
                self.clients.remove(client_socket)
                break
            json_message = json.loads(message)
            query_type = list(json_message.values())[0]
            json_message.pop(list(json_message.keys())[0])
            if query_type in ['file']:
                request, df = queries_with_functions.get(query_type)(*[arg for arg in json_message.values()])
                print(f"[^] Client resp message: {request}")
                await self.send_message(message=request)
            elif query_type in ['algorithms', 'metrics']:
                queries_with_functions.get(query_type)(*[arg for arg in json_message.values()])
            else:
                queries_with_functions.get(query_type)()


    async def start_server(self):
        await websockets.serve(self.new_client_connected, "localhost", PORT, max_size = None)
        # webbrowser.register('sber-browser', None, webbrowser.BackgroundBrowser("C:/Program Files (x86)/SberBrowser/Application/sberbrowser.exe"))
        # webbrowser.get('sber-browser').open(os.path.abspath('index.html'))
        # webbrowser.open_new(os.path.abspath('index.html'))


if __name__ == "__main__":
    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(Server().start_server())
    event_loop.run_forever()
