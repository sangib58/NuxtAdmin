export function useSiteError(context) {
  //console.log("context", context);
  //console.log("context", context?.statusMessage);
  //console.log("context", context?.request);
  const message = ref("");
  const config = useRuntimeConfig();
  if (context == null) {
    console.log("null....");
  } else {
    if (context?.status == 401) {
      message.value = "You current token has expired!";
    } else if (context?.status == 403) {
      message.value = "You have no permission to this resource";
    } else if (context?.status == 400) {
      message.value = "Bad request!";
    } else if (context?.status >= 500) {
      message.value = "Some server error!";
    } else {
      message.value = "Unknown error!";
    }
  }
  $fetch(config.public.apiUrl + `/api/Settings/CreateErrorLog`, {
    method: "POST",
    body: {
      status: context?.status,
      statusText: context?.statusText || context?.statusMessage,
      url: context?.url || context?.request,
      message: message.value,
    },
  });
  throw createError({
    statusCode: context?.status,
    statusMessage: message.value,
    statusText: context?.statusText,
    data: {
      url: context?.url,
    },
    fatal: true,
  });
}
