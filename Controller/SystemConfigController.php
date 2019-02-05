<?php declare(strict_types=1);

namespace Shopware\Administration\Controller;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Exception\MissingParameterException;
use Shopware\Core\System\SystemConfig\Service\ConfigurationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SystemConfigController extends AbstractController
{
    /**
     * @var ConfigurationService
     */
    private $configurationService;

    public function __construct(ConfigurationService $configurationService)
    {
        $this->configurationService = $configurationService;
    }

    /**
     * @Route("/api/v{version}/_action/core/system-config", name="api.action.core.system-config", methods={"GET"})
     *
     * @throws MissingParameterException
     */
    public function getConfiguration(Request $request, Context $context): JsonResponse
    {
        $namespace = $request->query->get('namespace');
        $salesChannelId = $request->query->get('sales_channel_id');

        if (!$namespace) {
            throw new MissingParameterException('namespace');
        }

        return new JsonResponse($this->configurationService->getConfiguration($namespace, $context, $salesChannelId));
    }
}
