<script>
	import PanelContainer from "$lib/components/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/chat.svelte";

	let code = `
lower = 900
upper = 1000

print("Prime numbers between", lower, "and", upper, "are:")

for num in range(lower, upper + 1):
   # all prime numbers are greater than 1
   if num > 1:
	   for i in range(2, num):
		   if (num % i) == 0:
			   break
	   else:
		   print(num)

lower = 900
upper = 1000

print("Prime numbers between", lower, "and", upper, "are:")

for num in range(lower, upper + 1):
   # all prime numbers are greater than 1
   if num > 1:
       for i in range(2, num):
           if (num % i) == 0:
               break
       else:
           print(num)

lower = 900
upper = 1000

print("Prime numbers between", lower, "and", upper, "are:")

for num in range(lower, upper + 1):
   # all prime numbers are greater than 1
   if num > 1:
       for i in range(2, num):
           if (num % i) == 0:
               break
       else:
           print(num)
lower = 900
upper = 1000

print("Prime numbers between", lower, "and", upper, "are:")

for num in range(lower, upper + 1):
   # all prime numbers are greater than 1
   if num > 1:
       for i in range(2, num):
           if (num % i) == 0:
               break
       else:
           print(num)
`;
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>
</svelte:head>

<!-- prettier-ignore -->
<py-script style="display: none;">
import pyodide
import js
    
class myClass():
    def __init__(self):
        self.add_one_proxy = pyodide.ffi.create_proxy(self.add_one)
        js.document.getElementById('mybutton').addEventListener("click", self.add_one_proxy)
        
    def add_one(self, pointerEventObj):
        """Callback from JS when a button is clicked"""
        btn_elem = pointerEventObj.currentTarget
        data = btn_elem.getAttribute('data-value')
        js.document.getElementById('resultdiv').innerHTML = str(int(data)+1)
        
    def shutdown(self):
        self.add_one_proxy.destroy()
    
klass = myClass()
# Make sure in the program to keep holding a reference of klass ...
# do the whole program here
# When all done, call klass.shutdown()
</py-script>
    

<PanelContainer>
	<div slot="left"><button on:click={() => (code = `print("no hello for you")`)}>Change Code</button></div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
		{/key}
	</div>
	<div slot="right">
		<Chat />
        <button id="mybutton" data-value="12" aria-label="Add one">Click Me</button>
        <div id="resultdiv">calculated data will come here on button click</div>
	</div>
</PanelContainer>
