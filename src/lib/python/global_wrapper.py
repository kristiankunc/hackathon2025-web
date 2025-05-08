from pyodide.ffi import create_proxy # type: ignore
import js # type: ignore

CODE_ELEMENT = js.document.getElementById("python-code")
OUTPUT_ELEMENT = js.document.getElementById("python-output")
ERROR_ELEMENT = js.document.getElementById("python-error")

call_stack = []

def forward():
	call_stack.append("forward")

def backward():
	call_stack.append("backward")

def left():
	call_stack.append("left")

def right():
	call_stack.append("right")

def print(content, *args):
	current_output = OUTPUT_ELEMENT.textContent
	if current_output:
		OUTPUT_ELEMENT.textContent = current_output + str(content) + "\n"
	else:
		OUTPUT_ELEMENT.textContent = str(content) + "\n"

def run_code(event):
	OUTPUT_ELEMENT.textContent = ""
	ERROR_ELEMENT.textContent = ""
	try:
		exec(CODE_ELEMENT.textContent)
	except Exception as e:
		js.document.getElementById("python-error").textContent = e


run_code_proxy = create_proxy(run_code)
js.document.getElementById("run-code-button").addEventListener("click", run_code_proxy)