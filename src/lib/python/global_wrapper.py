import asyncio
import time
import json

from pyodide.ffi import create_proxy # type: ignore
import js # type: ignore


CODE_ELEMENT = js.document.getElementById("python-code")
OUTPUT_ELEMENT = js.document.getElementById("python-output")
ERROR_ELEMENT = js.document.getElementById("python-error")
DATA_EXCHANGE_ELEMENT = js.document.getElementById("python-data-exchange")

"""
exchange format:
{
    "updatedAt": 0, (timestamp)
    "data": {
        "name": "variableName",
        "type": "string",
        "value": ""
    },
}
"""

def unity_call(func):
    def wrapper(*_args, **_kwargs):
        print("Calling Unity function: ", func.__name__)
    return wrapper

def unity_await(variable_name):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            current_timestamp = int(time.time())
            data = None

            while True:
                data = DATA_EXCHANGE_ELEMENT.textContent
                if data:
                    data = json.loads(data)
                    if data["updatedAt"] > current_timestamp:
                        break

                await asyncio.sleep(0.5)

            if data["data"]["name"] != variable_name:
                raise ValueError(f"Variable name mismatch: expected '{variable_name}', got '{data['data']['name']}'")
            
            match data["data"]["type"]:
                case "string":
                    value = str(data["data"]["value"])
                case "int":
                    value = int(data["data"]["value"])
                case "float":
                    value = float(data["data"]["value"])
                case "bool":
                    value = bool(data["data"]["value"])
                case _:
                    raise ValueError(f"Unsupported type: {data['data']['type']}")

            return value

        return wrapper
    return decorator


@unity_call
def forward():
    pass

@unity_call
def backward():
    pass

@unity_call
def left():
    pass

@unity_call
def right():
    pass

@unity_await("test")
async def wait_for_test():
    print("await completed")

def print(content, *args, **ignored_kwargs):
    combined_content = str(content) + ''.join(map(str, args))
    current_output = OUTPUT_ELEMENT.textContent

    if current_output:
        OUTPUT_ELEMENT.textContent = current_output + combined_content + "\n"
    else:
        OUTPUT_ELEMENT.textContent = combined_content + "\n"
     

async def run_code(event):
    OUTPUT_ELEMENT.textContent = ""
    ERROR_ELEMENT.textContent = ""

    try:
        user_code = CODE_ELEMENT.textContent
        indented_code = "\n".join("    " + line for line in user_code.splitlines())
        full_code = f"async def __user_code__():\n{indented_code}"

        exec(full_code, globals())
        await globals()["__user_code__"]()
    except Exception as e:
        ERROR_ELEMENT.textContent = str(e)


run_code_proxy = create_proxy(run_code)
js.document.getElementById("run-code-button").addEventListener("click", run_code_proxy)
